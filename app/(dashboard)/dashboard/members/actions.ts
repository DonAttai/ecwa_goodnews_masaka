"use server"

import { prisma } from "@/lib/prisma"
import type { Prisma } from "@/generated/prisma/client"
import { revalidatePath } from "next/cache"
import { requireAdmin, requireEditor } from "@/lib/auth"
import { sendMemberCreationEmail } from "@/lib/email/send-member-creation-email"
import {
  memberFormSchema,
  memberUpdateSchema,
  type MemberCreateData,
  type MemberCreateInput,
  type MemberUpdateData,
  type MemberUpdateInput,
} from "./schemas"
import { resolveMemberPayload } from "./payload"
import {
  findChildNameOverlap,
  findInternalChildDuplicates,
  normalizeChildName,
  uniqueChildKeys,
} from "./child-utils"
import {
  rankChildMatch,
  rankSpouseCandidate,
  tokenizePersonName,
  type ChildMatch,
  type SpouseCandidate,
} from "./matching"
import { toActionResultError, type ActionResult } from "../lib/action-result"
import { logAudit } from "../lib/audit"

function toDateOrNull(value: string | null | undefined): Date | null {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

type ChildInput = { id?: string; name: string; contact?: string }

function getChildDuplicateAcks(
  input: MemberCreateInput | MemberUpdateInput | FormData
): Set<string> {
  if (!(input instanceof FormData)) return new Set()
  const raw = input.get("childDuplicateAcks")
  if (!raw) return new Set()
  try {
    const parsed = JSON.parse(String(raw))
    if (!Array.isArray(parsed)) return new Set()
    return new Set(
      parsed
        .map((name) => normalizeChildName(String(name)))
        .filter((name) => name)
    )
  } catch {
    return new Set()
  }
}

type ChildMatchRow = {
  name: string
  member: {
    id: string
    firstName: string
    surname: string
    presentAddress: string
    homeCell: string | null
    zone: string | null
    phoneNumber: string
    spouseId: string | null
    children: Array<{ name: string }>
  }
}

/**
 * Finds children already recorded under other members. This is the safety net
 * that works even when the spouse was never linked: the volunteer recognises
 * the child and can link the family on the spot.
 */
async function findChildMatchGroups(params: {
  names: string[]
  excludeMemberId?: string
  excludeSpouseIds?: Array<string | null | undefined>
  surname?: string
  address?: string
  homeCell?: string
  zone?: string
}): Promise<ChildMatch[]> {
  const targets = uniqueChildKeys(params.names)
  if (targets.length === 0) return []

  const targetTokens = targets.map((name) => name.split(" ").filter(Boolean))
  const excluded = [
    params.excludeMemberId,
    ...(params.excludeSpouseIds ?? []),
  ].filter((id): id is string => Boolean(id))

  const rows = await prisma.child.findMany({
    where: {
      ...(excluded.length > 0 ? { memberId: { notIn: excluded } } : {}),
      OR: targetTokens.map((tokens) => ({
        AND: tokens.map((token) => ({
          name: { contains: token, mode: "insensitive" },
        })),
      })),
    },
    select: {
      name: true,
      member: {
        select: {
          id: true,
          firstName: true,
          surname: true,
          presentAddress: true,
          homeCell: true,
          zone: true,
          phoneNumber: true,
          spouseId: true,
          children: { select: { name: true }, orderBy: { createdAt: "asc" } },
        },
      },
    },
    take: 300,
  })

  const targetSet = new Set(targets)
  const groups = new Map<
    string,
    { member: ChildMatchRow["member"]; matched: Set<string> }
  >()

  for (const row of rows) {
    if (!targetSet.has(normalizeChildName(row.name))) continue
    const existing = groups.get(row.member.id)
    if (existing) {
      existing.matched.add(row.name)
    } else {
      groups.set(row.member.id, {
        member: row.member,
        matched: new Set([row.name]),
      })
    }
  }

  return [...groups.values()]
    .map(({ member, matched }) => {
      const matchedChildren = [...matched]
      const { score, reasons } = rankChildMatch(matchedChildren, member, params)
      return {
        memberId: member.id,
        name: `${member.firstName} ${member.surname}`,
        address: member.presentAddress,
        homeCell: member.homeCell,
        zone: member.zone,
        phoneNumber: member.phoneNumber,
        spouseId: member.spouseId,
        matchedChildren,
        allChildren: member.children.map((child) => child.name),
        reasons,
        score,
      }
    })
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
    .slice(0, 20)
}

function blockingChildMatches(
  matches: ChildMatch[],
  acks: Set<string>
): ChildMatch[] {
  return matches
    .map((match) => ({
      ...match,
      matchedChildren: match.matchedChildren.filter(
        (name) => !acks.has(normalizeChildName(name))
      ),
    }))
    .filter((match) => match.matchedChildren.length > 0)
}

export async function createMember(
  input: MemberCreateInput | FormData
): Promise<ActionResult<{ memberId: string }>> {
  try {
    const admin = await requireEditor()

    const parsed = memberFormSchema.safeParse(resolveMemberPayload(input))

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors
      return {
        success: false,
        message: "Please check the form for errors",
        fieldErrors,
      }
    }

    const data: MemberCreateData = parsed.data

    const existingEmail = data.email
      ? await prisma.member.findFirst({ where: { email: data.email } })
      : null
    if (existingEmail) {
      return {
        success: false,
        message: "A member with this email already exists",
        fieldErrors: { email: ["A member with this email already exists"] },
      }
    }

    const normalizedPhone = data.phoneNumber.replace(/[\s\-()]/g, "")
    const phoneCandidates = Array.from(
      new Set([
        data.phoneNumber,
        normalizedPhone,
        normalizedPhone.startsWith("+")
          ? normalizedPhone.slice(1)
          : `+${normalizedPhone}`,
        normalizedPhone.replace(/^\+?234/, "0"),
      ])
    )
    const existingPhone = await prisma.member.findFirst({
      where: { phoneNumber: { in: phoneCandidates } },
      select: { id: true, firstName: true, surname: true },
    })
    if (existingPhone) {
      const name = `${existingPhone.firstName} ${existingPhone.surname}`
      return {
        success: false,
        message: `A member with this phone number already exists (${name})`,
        fieldErrors: {
          phoneNumber: [
            `This number is already registered to ${name}. Search members to update instead.`,
          ],
        },
      }
    }

    // Only honour a spouse link for members recorded as married; the picker is
    // hidden otherwise, but stale form state could still submit an id.
    const spouseId =
      data.maritalStatus === "MARRIED" ? data.spouseId || null : null
    let spouse: {
      id: string
      firstName: string
      surname: string
      spouseId: string | null
      children: Array<{ name: string }>
    } | null = null

    if (spouseId) {
      spouse = await prisma.member.findUnique({
        where: { id: spouseId },
        select: {
          id: true,
          firstName: true,
          surname: true,
          spouseId: true,
          children: { select: { name: true } },
        },
      })

      if (!spouse) {
        return {
          success: false,
          message: "Selected spouse could not be found",
          fieldErrors: { spouseId: ["Selected spouse could not be found"] },
        }
      }

      if (spouse.spouseId) {
        return {
          success: false,
          message: "That member is already linked to another spouse",
          fieldErrors: {
            spouseId: ["That member is already linked to another spouse"],
          },
        }
      }

      const duplicateChildren = findChildNameOverlap(
        data.children,
        spouse.children
      )
      if (duplicateChildren.length > 0) {
        const spouseName = `${spouse.firstName} ${spouse.surname}`
        return {
          success: false,
          message: `Some children are already recorded under ${spouseName}`,
          fieldErrors: {
            children: [
              `Already recorded under ${spouseName}: ${duplicateChildren.join(", ")}. Leave them out — they will show on both records.`,
            ],
          },
        }
      }
    }

    const acks = getChildDuplicateAcks(input)
    const childMatches = await findChildMatchGroups({
      names: data.children.map((child) => child.name),
      excludeSpouseIds: [spouseId],
      surname: data.surname,
      address: data.presentAddress,
      homeCell: data.homeCell,
      zone: data.zone,
    })
    const unresolvedMatches = blockingChildMatches(childMatches, acks)
    if (unresolvedMatches.length > 0) {
      const summary = unresolvedMatches
        .map(
          (match) => `${match.matchedChildren.join(", ")} under ${match.name}`
        )
        .join("; ")
      return {
        success: false,
        message: "Some children are already recorded elsewhere",
        fieldErrors: {
          children: [
            `Already recorded: ${summary}. Link the family or confirm they are different children.`,
          ],
        },
      }
    }

    const member = await prisma.$transaction(async (tx) => {
      const created = await tx.member.create({
        data: {
          surname: data.surname,
          firstName: data.firstName,
          otherNames: data.otherNames,
          presentAddress: data.presentAddress,
          phoneNumber: data.phoneNumber,
          email: data.email,
          previousPlaceOfWorship: data.previousPlaceOfWorship,
          gender: data.gender,
          maritalStatus: data.maritalStatus,
          spouseName: data.spouseName,
          spouseId,
          homeCell: data.homeCell,
          zone: data.zone,
          stateOfOrigin: data.stateOfOrigin,
          lga: data.lga,
          tribe: data.tribe,
          passportUrl: data.passportUrl || null,
          acceptedChrist: data.acceptedChrist,
          baptized: data.baptized,
          baptismPlace: data.baptismPlace,
          baptizedBy: data.baptizedBy,
          communicant: data.communicant,
          beenOnDiscipline: data.beenOnDiscipline,
          disciplineReason: data.disciplineReason,
          disciplineDate: toDateOrNull(data.disciplineDate),
          disciplineReliefDate: toDateOrNull(data.disciplineReliefDate),
          previousChurchPosition: data.previousChurchPosition,
          suggestions: data.suggestions,
          memberSignature: data.memberSignature,
          memberSignedDate: toDateOrNull(data.memberSignedDate),
          pastorSignature: data.pastorSignature,
          pastorSignedDate: toDateOrNull(data.pastorSignedDate),
        },
      })

      if (spouseId) {
        await tx.member.update({
          where: { id: spouseId },
          data: { spouseId: created.id },
        })
      }

      if (data.children.length > 0) {
        await tx.child.createMany({
          data: data.children.map((child) => ({
            name: child.name,
            contact: child.contact,
            memberId: created.id,
          })),
        })
      }

      if (data.fellowshipGroupIds.length > 0) {
        await tx.memberFellowship.createMany({
          data: data.fellowshipGroupIds.map((fellowshipId) => ({
            memberId: created.id,
            fellowshipId,
            addedAt: new Date(),
          })),
          skipDuplicates: true,
        })
      }

      return created
    })

    const memberName = `${member.firstName} ${member.surname}`

    await logAudit({
      user: admin,
      action: "CREATE_MEMBER",
      entity: "MEMBER",
      entityId: member.id,
      description: `${admin.name} created member ${memberName}`,
      metadata: { memberEmail: member.email },
    })

    if (member.email) {
      try {
        await sendMemberCreationEmail({ email: member.email, name: memberName })
      } catch (emailError) {
        console.error("[server-action] Failed to send member creation email", {
          error: emailError,
          memberId: member.id,
        })
      }
    }

    revalidatePath("/dashboard/members")
    revalidatePath(`/dashboard/members/${member.id}`)

    return {
      success: true,
      message: "Member created successfully",
      data: { memberId: member.id },
    }
  } catch (error) {
    return toActionResultError(
      error,
      "Server error occurred while creating member"
    )
  }
}

export async function updateMember(
  memberId: string,
  input: MemberUpdateInput | FormData
): Promise<ActionResult> {
  try {
    const admin = await requireAdmin()

    const existingMember = await prisma.member.findUnique({
      where: { id: memberId },
      include: { children: true },
    })

    if (!existingMember) {
      return { success: false, message: "Member not found" }
    }

    const parsed = memberUpdateSchema.safeParse({
      ...resolveMemberPayload(input),
      id: memberId,
    })

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors
      return {
        success: false,
        message: "Please check the form for errors",
        fieldErrors,
      }
    }

    const data: MemberUpdateData = parsed.data

    if (data.email) {
      const duplicate = await prisma.member.findFirst({
        where: { email: data.email, id: { not: memberId } },
      })
      if (duplicate) {
        return {
          success: false,
          message: "Another member already uses this email",
          fieldErrors: { email: ["Another member already uses this email"] },
        }
      }
    }

    const existingSpouseId = existingMember.spouseId
    const desiredSpouseId =
      data.spouseId === undefined ? existingSpouseId : data.spouseId || null

    let newSpouse: {
      id: string
      firstName: string
      surname: string
      spouseId: string | null
      children: Array<{ name: string }>
    } | null = null

    if (desiredSpouseId && desiredSpouseId !== existingSpouseId) {
      if (desiredSpouseId === memberId) {
        return {
          success: false,
          message: "A member cannot be their own spouse",
          fieldErrors: { spouseId: ["A member cannot be their own spouse"] },
        }
      }

      newSpouse = await prisma.member.findUnique({
        where: { id: desiredSpouseId },
        select: {
          id: true,
          firstName: true,
          surname: true,
          spouseId: true,
          children: { select: { name: true } },
        },
      })

      if (!newSpouse) {
        return {
          success: false,
          message: "Selected spouse could not be found",
          fieldErrors: { spouseId: ["Selected spouse could not be found"] },
        }
      }

      if (newSpouse.spouseId && newSpouse.spouseId !== memberId) {
        return {
          success: false,
          message: "That member is already linked to another spouse",
          fieldErrors: {
            spouseId: ["That member is already linked to another spouse"],
          },
        }
      }

      const submittedChildren = data.children ?? existingMember.children
      const duplicateChildren = findChildNameOverlap(
        submittedChildren,
        newSpouse.children
      )
      if (duplicateChildren.length > 0) {
        const spouseName = `${newSpouse.firstName} ${newSpouse.surname}`
        return {
          success: false,
          message: `Some children are already recorded under ${spouseName}`,
          fieldErrors: {
            children: [
              `Already recorded under ${spouseName}: ${duplicateChildren.join(", ")}. Remove them from this record before linking.`,
            ],
          },
        }
      }
    }

    // Reconcile children: update kept rows, create new ones, delete removed ones.
    const childrenToCreate: ChildInput[] = []
    const childrenToUpdate: Array<{
      id: string
      name: string
      contact?: string
    }> = []
    let childIdsToDelete: string[] = []

    if (data.children !== undefined) {
      const existingIds = new Set(
        existingMember.children.map((child) => child.id)
      )
      const keptIds = new Set<string>()

      for (const child of data.children) {
        if (child.id && existingIds.has(child.id)) {
          keptIds.add(child.id)
          childrenToUpdate.push({
            id: child.id,
            name: child.name,
            contact: child.contact,
          })
        } else {
          childrenToCreate.push({ name: child.name, contact: child.contact })
        }
      }

      childIdsToDelete = existingMember.children
        .filter((child) => !keptIds.has(child.id))
        .map((child) => child.id)
    }

    // Renamed rows and brand-new rows must not duplicate another record.
    // Untouched rows are left alone so pre-existing data can be cleaned up
    // without blocking unrelated edits.
    const renamedChildren = childrenToUpdate.filter((child) => {
      const previous = existingMember.children.find(
        (existing) => existing.id === child.id
      )
      return (
        previous &&
        normalizeChildName(previous.name) !== normalizeChildName(child.name)
      )
    })
    const childrenToCheck = [...renamedChildren, ...childrenToCreate]

    const untouchedChildren = existingMember.children.filter(
      (child) =>
        !childIdsToDelete.includes(child.id) &&
        !renamedChildren.some((renamed) => renamed.id === child.id)
    )

    const internalDuplicates = [
      ...findInternalChildDuplicates(childrenToCheck),
      ...findChildNameOverlap(childrenToCheck, untouchedChildren),
    ]
    if (internalDuplicates.length > 0) {
      return {
        success: false,
        message: "The same child is listed more than once",
        fieldErrors: {
          children: [
            `Remove the duplicate entries: ${internalDuplicates.join(", ")}`,
          ],
        },
      }
    }

    if (desiredSpouseId && childrenToCheck.length > 0) {
      let spouseChildren = newSpouse?.children
      if (!spouseChildren) {
        const linkedSpouse = await prisma.member.findUnique({
          where: { id: desiredSpouseId },
          select: { children: { select: { name: true } } },
        })
        spouseChildren = linkedSpouse?.children ?? []
      }

      const duplicateChildren = findChildNameOverlap(
        childrenToCheck,
        spouseChildren
      )
      if (duplicateChildren.length > 0) {
        const spouseName = newSpouse
          ? `${newSpouse.firstName} ${newSpouse.surname}`
          : (existingMember.spouseName ?? "your spouse")
        return {
          success: false,
          message: `Some children are already recorded under ${spouseName}`,
          fieldErrors: {
            children: [
              `Already recorded under ${spouseName}: ${duplicateChildren.join(", ")}. They already show on both records.`,
            ],
          },
        }
      }
    }

    if (childrenToCheck.length > 0) {
      const acks = getChildDuplicateAcks(input)
      const childMatches = await findChildMatchGroups({
        names: childrenToCheck.map((child) => child.name),
        excludeMemberId: memberId,
        excludeSpouseIds: [existingSpouseId, desiredSpouseId],
        surname: data.surname ?? existingMember.surname,
        address: data.presentAddress ?? existingMember.presentAddress,
        homeCell: data.homeCell ?? existingMember.homeCell ?? undefined,
        zone: data.zone ?? existingMember.zone ?? undefined,
      })
      const unresolvedMatches = blockingChildMatches(childMatches, acks)
      if (unresolvedMatches.length > 0) {
        const summary = unresolvedMatches
          .map(
            (match) => `${match.matchedChildren.join(", ")} under ${match.name}`
          )
          .join("; ")
        return {
          success: false,
          message: "Some children are already recorded elsewhere",
          fieldErrors: {
            children: [
              `Already recorded: ${summary}. Link the family or confirm they are different children.`,
            ],
          },
        }
      }
    }

    const existingFellowshipIds = new Set(
      (
        await prisma.memberFellowship.findMany({
          where: { memberId },
          select: { fellowshipId: true },
        })
      ).map((association) => association.fellowshipId)
    )
    const newFellowshipIds = (data.fellowshipGroupIds ?? []).filter(
      (fellowshipId) => !existingFellowshipIds.has(fellowshipId)
    )

    await prisma.$transaction(async (tx) => {
      await tx.member.update({
        where: { id: memberId },
        data: {
          surname: data.surname,
          firstName: data.firstName,
          otherNames: data.otherNames,
          presentAddress: data.presentAddress,
          phoneNumber: data.phoneNumber,
          email: data.email,
          passportUrl: data.passportUrl || null,
          maritalStatus: data.maritalStatus,
          spouseName: data.spouseName,
          spouseId: desiredSpouseId,
          homeCell: data.homeCell,
          zone: data.zone,
          acceptedChrist: data.acceptedChrist,
          baptized: data.baptized,
          baptismPlace: data.baptismPlace,
          baptizedBy: data.baptizedBy,
          communicant: data.communicant,
          beenOnDiscipline: data.beenOnDiscipline,
          disciplineReason: data.disciplineReason,
          disciplineDate: toDateOrNull(data.disciplineDate),
          disciplineReliefDate: toDateOrNull(data.disciplineReliefDate),
        },
      })

      // Keep both sides of the spouse link in sync.
      if (existingSpouseId && existingSpouseId !== desiredSpouseId) {
        await tx.member.update({
          where: { id: existingSpouseId },
          data: { spouseId: null },
        })
      }
      if (desiredSpouseId && desiredSpouseId !== existingSpouseId) {
        await tx.member.update({
          where: { id: desiredSpouseId },
          data: { spouseId: memberId },
        })
      }

      if (childIdsToDelete.length > 0) {
        await tx.child.deleteMany({
          where: { id: { in: childIdsToDelete }, memberId },
        })
      }

      for (const child of childrenToUpdate) {
        await tx.child.update({
          where: { id: child.id },
          data: { name: child.name, contact: child.contact },
        })
      }

      if (childrenToCreate.length > 0) {
        await tx.child.createMany({
          data: childrenToCreate.map((child) => ({
            name: child.name,
            contact: child.contact,
            memberId,
          })),
        })
      }

      if (newFellowshipIds.length > 0) {
        await tx.memberFellowship.createMany({
          data: newFellowshipIds.map((fellowshipId) => ({
            memberId,
            fellowshipId,
            addedAt: new Date(),
          })),
        })
      }
    })

    const memberName = `${existingMember.firstName} ${existingMember.surname}`

    await logAudit({
      user: admin,
      action: "UPDATE_MEMBER",
      entity: "MEMBER",
      entityId: memberId,
      description: `${admin.name} updated member ${memberName}'s profile`,
      metadata: { memberEmail: existingMember.email },
    })

    revalidatePath(`/dashboard/members/${memberId}`)
    revalidatePath("/dashboard/members")

    return { success: true, message: "Member updated successfully" }
  } catch (error) {
    return toActionResultError(error, "Failed to update member")
  }
}

export async function searchMembersForSpouse(params: {
  name: string
  excludeId?: string
  surname?: string
  address?: string
  homeCell?: string
  zone?: string
  childNames?: string[]
  gender?: string | null
}): Promise<SpouseCandidate[]> {
  await requireEditor()

  const tokens = tokenizePersonName(params.name)
  if (tokens.length === 0) return []

  const exclude = params.excludeId ? { id: { not: params.excludeId } } : {}
  const select = {
    id: true,
    firstName: true,
    surname: true,
    otherNames: true,
    spouseId: true,
    presentAddress: true,
    homeCell: true,
    zone: true,
    gender: true,
    maritalStatus: true,
    children: { select: { name: true }, orderBy: { createdAt: "asc" } },
  } as const

  let members = await prisma.member.findMany({
    where: {
      ...exclude,
      AND: tokens.map((token) => ({
        OR: [
          { firstName: { contains: token, mode: "insensitive" } },
          { surname: { contains: token, mode: "insensitive" } },
          { otherNames: { contains: token, mode: "insensitive" } },
        ],
      })),
    },
    select,
    take: 40,
  })

  // If the paper name is misspelled or the spouse uses a different name, fall
  // back to the household details already being entered. This also runs when
  // the name search only found a few weak candidates, so the right person is
  // not hidden by a coincidental name match.
  if (members.length < 3) {
    const fallback: Prisma.MemberWhereInput[] = []
    const address = params.address?.trim() ?? ""
    const homeCell = params.homeCell?.trim() ?? ""
    if (address.length >= 5) {
      fallback.push({
        presentAddress: { contains: address, mode: "insensitive" },
      })
    }
    if (homeCell.length >= 3) {
      fallback.push({ homeCell: { contains: homeCell, mode: "insensitive" } })
    }
    if (fallback.length > 0) {
      const householdMatches = await prisma.member.findMany({
        where: { ...exclude, maritalStatus: "MARRIED", OR: fallback },
        select,
        take: 40,
      })
      const seen = new Set(members.map((member) => member.id))
      members = [
        ...members,
        ...householdMatches.filter((member) => !seen.has(member.id)),
      ]
    }
  }

  return members
    .map((member) => {
      const { score, reasons } = rankSpouseCandidate(member, params)
      return { member, score, reasons }
    })
    .sort(
      (a, b) =>
        b.score - a.score ||
        a.member.surname.localeCompare(b.member.surname) ||
        a.member.firstName.localeCompare(b.member.firstName)
    )
    .slice(0, 8)
    .map(({ member, reasons }) => ({
      id: member.id,
      name: `${member.firstName} ${member.surname}`,
      firstName: member.firstName,
      surname: member.surname,
      otherNames: member.otherNames,
      spouseId: member.spouseId,
      address: member.presentAddress,
      homeCell: member.homeCell,
      zone: member.zone,
      gender: member.gender,
      maritalStatus: member.maritalStatus,
      children: member.children.map((child) => child.name),
      reasons,
    }))
}

export async function findChildMatches(params: {
  names: string[]
  excludeMemberId?: string
  excludeSpouseId?: string | null
  surname?: string
  address?: string
  homeCell?: string
  zone?: string
}): Promise<ChildMatch[]> {
  await requireEditor()

  return findChildMatchGroups({
    names: params.names,
    excludeMemberId: params.excludeMemberId,
    excludeSpouseIds: [params.excludeSpouseId],
    surname: params.surname,
    address: params.address,
    homeCell: params.homeCell,
    zone: params.zone,
  })
}

export async function linkMemberSpouse(
  memberId: string,
  spouseId: string
): Promise<ActionResult> {
  try {
    const admin = await requireAdmin()

    if (memberId === spouseId) {
      return { success: false, message: "A member cannot be their own spouse" }
    }

    const [member, spouse] = await Promise.all([
      prisma.member.findUnique({
        where: { id: memberId },
        select: {
          id: true,
          firstName: true,
          surname: true,
          spouseId: true,
          children: { select: { name: true } },
        },
      }),
      prisma.member.findUnique({
        where: { id: spouseId },
        select: {
          id: true,
          firstName: true,
          surname: true,
          spouseId: true,
          children: { select: { name: true } },
        },
      }),
    ])

    if (!member || !spouse) {
      return { success: false, message: "Member not found" }
    }

    if (member.spouseId === spouseId && spouse.spouseId === memberId) {
      return { success: true, message: "Spouse already linked" }
    }

    if (member.spouseId && member.spouseId !== spouseId) {
      return {
        success: false,
        message: "This member is already linked to another spouse",
      }
    }

    if (spouse.spouseId && spouse.spouseId !== memberId) {
      return {
        success: false,
        message: "That member is already linked to another spouse",
      }
    }

    const duplicateChildren = findChildNameOverlap(
      member.children,
      spouse.children
    )
    if (duplicateChildren.length > 0) {
      return {
        success: false,
        message: `Remove the duplicate child entries first: ${duplicateChildren.join(", ")}`,
      }
    }

    await prisma.$transaction([
      prisma.member.update({
        where: { id: memberId },
        data: { spouseId },
      }),
      prisma.member.update({
        where: { id: spouseId },
        data: { spouseId: memberId },
      }),
    ])

    await logAudit({
      user: admin,
      action: "UPDATE_MEMBER",
      entity: "MEMBER",
      entityId: memberId,
      description: `${admin.name} linked ${member.firstName} ${member.surname} to spouse ${spouse.firstName} ${spouse.surname}`,
      metadata: { spouseId },
    })

    revalidatePath(`/dashboard/members/${memberId}`)
    revalidatePath(`/dashboard/members/${spouseId}`)
    revalidatePath("/dashboard/members")

    return {
      success: true,
      message: `Linked to ${spouse.firstName} ${spouse.surname}`,
    }
  } catch (error) {
    return toActionResultError(error, "Failed to link spouse")
  }
}

export async function getSpouseChildren(
  spouseId: string
): Promise<{ name: string; children: string[] } | null> {
  await requireEditor()

  const spouse = await prisma.member.findUnique({
    where: { id: spouseId },
    select: {
      firstName: true,
      surname: true,
      children: { select: { name: true }, orderBy: { createdAt: "asc" } },
    },
  })

  if (!spouse) return null

  return {
    name: `${spouse.firstName} ${spouse.surname}`,
    children: spouse.children.map((child) => child.name),
  }
}

export async function deleteMember(memberId: string): Promise<ActionResult> {
  try {
    const admin = await requireAdmin()

    const memberToDelete = await prisma.member.findUnique({
      where: { id: memberId },
      select: { email: true, firstName: true, surname: true },
    })

    if (!memberToDelete) {
      return { success: false, message: "Member not found" }
    }

    await prisma.member.delete({ where: { id: memberId } })

    const memberName = `${memberToDelete.firstName} ${memberToDelete.surname}`

    await logAudit({
      user: admin,
      action: "DELETE_MEMBER",
      entity: "MEMBER",
      entityId: memberId,
      description: `${admin.name} deleted member ${memberName}`,
      metadata: { memberEmail: memberToDelete.email },
    })

    revalidatePath("/dashboard/members")

    return { success: true, message: "Member deleted successfully" }
  } catch (error) {
    return toActionResultError(error, "Failed to delete member")
  }
}
