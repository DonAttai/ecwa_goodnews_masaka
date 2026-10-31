"use server"

import { prisma } from "@/lib/prisma"
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
import { normalizeChildName } from "./child-utils"
import { toActionResultError, type ActionResult } from "../lib/action-result"
import { logAudit } from "../lib/audit"

function toDateOrNull(value: string | null | undefined): Date | null {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

type ChildInput = { id?: string; name: string; contact?: string }

function findChildNameOverlap(
  children: Array<{ name: string }>,
  otherChildren: Array<{ name: string }>
): string[] {
  const otherKeys = new Set(
    otherChildren.map((child) => normalizeChildName(child.name))
  )
  return children
    .filter((child) => otherKeys.has(normalizeChildName(child.name)))
    .map((child) => child.name)
}

function findInternalChildDuplicates(
  children: Array<{ name: string }>
): string[] {
  const seen = new Set<string>()
  const duplicates = new Set<string>()
  for (const child of children) {
    const key = normalizeChildName(child.name)
    if (!key) continue
    if (seen.has(key)) duplicates.add(child.name)
    seen.add(key)
  }
  return [...duplicates]
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

    const internalDuplicates = findInternalChildDuplicates([
      ...childrenToUpdate,
      ...childrenToCreate,
    ])
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

    if (desiredSpouseId) {
      // Renamed rows and brand-new rows must not duplicate the spouse's list.
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

      if (childrenToCheck.length > 0) {
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

export async function searchMembersForSpouse(
  query: string,
  excludeId?: string
): Promise<
  Array<{
    id: string
    name: string
    spouseId: string | null
    children: string[]
  }>
> {
  await requireEditor()

  const term = query.trim()
  if (term.length < 2) return []

  const members = await prisma.member.findMany({
    where: {
      ...(excludeId ? { id: { not: excludeId } } : {}),
      OR: [
        { firstName: { contains: term, mode: "insensitive" } },
        { surname: { contains: term, mode: "insensitive" } },
        { otherNames: { contains: term, mode: "insensitive" } },
      ],
    },
    select: {
      id: true,
      firstName: true,
      surname: true,
      otherNames: true,
      spouseId: true,
      children: { select: { name: true }, orderBy: { createdAt: "asc" } },
    },
    orderBy: [{ surname: "asc" }, { firstName: "asc" }],
    take: 8,
  })

  return members.map((member) => ({
    id: member.id,
    name: `${member.firstName} ${member.surname}`,
    spouseId: member.spouseId,
    children: member.children.map((child) => child.name),
  }))
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
