"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { requireAdmin } from "@/lib/auth"
import { sendMemberCreationEmail } from "@/lib/email/send-member-creation-email"
import {
  memberFormSchema,
  memberUpdateSchema,
  type MemberCreateData,
  type MemberCreateInput,
  type MemberUpdateData,
  type MemberUpdateInput,
} from "./schemas"
import { toActionResultError, type ActionResult } from "../lib/action-result"
import { logAudit } from "../lib/audit"

type MemberPayloadInput = MemberCreateInput | MemberUpdateInput | FormData

function toDateOrNull(value: string | null | undefined): Date | null {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

const OPTIONAL_STRING_FIELDS = [
  "otherNames",
  "email",
  "previousPlaceOfWorship",
  "spouseName",
  "homeCell",
  "zone",
  "passportUrl",
  "baptismPlace",
  "baptizedBy",
  "disciplineReason",
  "disciplineDate",
  "disciplineReliefDate",
  "previousChurchPosition",
  "suggestions",
  "memberSignature",
  "memberSignedDate",
  "pastorSignature",
  "pastorSignedDate",
] as const

function parseJsonArray(value: FormDataEntryValue | null): unknown[] {
  if (!value) return []
  try {
    const parsed = JSON.parse(String(value))
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

/**
 * Normalizes either a typed payload or raw `FormData` into a plain object
 * suitable for schema validation. Centralizes all field extraction and the
 * previously duplicated (and fragile) manual `formData.get()` calls.
 */
function resolveMemberPayload(input: MemberPayloadInput): Record<string, unknown> {
  if (!(input instanceof FormData)) return input as Record<string, unknown>

  const formData = input
  const data: Record<string, unknown> = {}

  for (const key of [
    "surname",
    "firstName",
    "presentAddress",
    "phoneNumber",
    "maritalStatus",
    "gender",
    "stateOfOrigin",
    "lga",
    "tribe",
    ...OPTIONAL_STRING_FIELDS,
  ]) {
    const value = formData.get(key)
    if (value != null && value !== "") data[key] = String(value)
  }

  const children = parseJsonArray(formData.get("children"))
  if (children.length > 0) data.children = children

  const fellowshipGroupIds = parseJsonArray(formData.get("fellowshipGroupIds"))
  if (fellowshipGroupIds.length > 0) data.fellowshipGroupIds = fellowshipGroupIds

  return data
}

export async function createMember(
  input: MemberCreateInput | FormData
): Promise<ActionResult<{ memberId: string }>> {
  try {
    const admin = await requireAdmin()

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
          homeCell: data.homeCell,
          zone: data.zone,
          stateOfOrigin: data.stateOfOrigin,
          lga: data.lga,
          tribe: data.tribe,
          passportUrl: data.passportUrl,
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

    const existingChildKeys = new Set(
      existingMember.children.map(
        (child) => `${child.name}-${child.contact ?? ""}`
      )
    )
    const childrenToAdd = (data.children ?? []).filter(
      (child) => !existingChildKeys.has(`${child.name}-${child.contact ?? ""}`)
    )

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
          maritalStatus: data.maritalStatus,
          spouseName: data.spouseName,
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

      if (childrenToAdd.length > 0) {
        await tx.child.createMany({
          data: childrenToAdd.map((child) => ({
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
