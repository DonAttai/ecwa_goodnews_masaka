"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/app/actions/auth"
import { redirect } from "next/navigation"
import { requisitionSchema, RequisitionType } from "./schema"
import { RequisitionStatus, Role } from "@/generated/prisma/enums"
import { createNotification } from "@/lib/notifications"
import { Prisma } from "@/generated/prisma/client"
import { requisitionStatusPermissions } from "./permissions"

// create requisition
export async function createRequisition(input: RequisitionType) {
  const user = await getCurrentUser()
  if (user === null) redirect("/login")

  const allowedRoles: Role[] = Object.values(Role)

  if (!allowedRoles.includes(user.role)) {
    return {
      success: false,
      message: "you don't have permission to create requisitions.",
    }
  }

  const validated = requisitionSchema.safeParse(input)
  if (!validated.success) {
    return {
      success: false,
      message: validated.error.issues[0]?.message ?? "Invalid requisition",
    }
  }

  const data = validated.data
  const departmentId = user.department ? user.department?.id : null

  if (
    (user.role === "WORKER" ||
      user.role === "USER" ||
      user.role === "FINANCE") &&
    !departmentId
  ) {
    return {
      success: false,
      message:
        "Your account must be linked to a department before submitting requisitions.",
    }
  }

  const requisition = await prisma.requisition.create({
    data: {
      title: data.title,
      description: data.description ?? null,
      category: data.category,
      amount: data.amount,
      currency: data.currency,
      priority: data.priority,
      status: data.status ?? "SUBMITTED",
      neededBy: data.neededBy ? new Date(data.neededBy) : null,
      requestedById: user.id,
      departmentId: departmentId ?? null,
    },
  })

  const admins = await prisma.user.findMany({
    where: { role: "ADMIN" },
    select: { id: true },
  })

  if (admins.length > 0) {
    await Promise.all(
      admins.map((admin) =>
        createNotification({
          userId: admin.id,
          title: "New requisition request",
          message: `${user.name} submitted a new requisition: ${requisition.title}`,
          type: "INFO",
          link: "/dashboard/requisitions",
        })
      )
    )
  }

  revalidatePath("/dashboard/requisitions")
  return { success: true, message: "Requisition submitted successfully." }
}

// update requisition status
export async function updateRequisitionStatus(
  id: string,
  newStatus: RequisitionStatus,
  rejectionReason?: string
) {
  const user = await getCurrentUser()

  if (!user) redirect("/login")

  const requisition = await prisma.requisition.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      status: true,
      requestedById: true,
    },
  })

  if (!requisition) {
    return {
      success: false,
      message: "Requisition not found.",
    }
  }

  // Prevent self approval/rejection/completion
  if (requisition.requestedById === user.id) {
    return {
      success: false,
      message: "You cannot perform actions on your own requisition.",
    }
  }

  // Prevent updating immutable requisitions
  const immutableStatuses: RequisitionStatus[] = [
    RequisitionStatus.REJECTED,
    RequisitionStatus.COMPLETED,
  ]

  if (immutableStatuses.includes(requisition.status)) {
    return {
      success: false,
      message: `Cannot modify a ${requisition.status.toLowerCase()} requisition.`,
    }
  }

  // Prevent redundant updates
  if (requisition.status === newStatus) {
    return {
      success: false,
      message: `Requisition is already ${newStatus.toLowerCase()}.`,
    }
  }

  if (!requisitionStatusPermissions[newStatus].includes(user.role)) {
    return {
      success: false,
      message: "You do not have permission to perform this action.",
    }
  }

  // Validate state transitions
  const validTransitions: Record<RequisitionStatus, RequisitionStatus[]> = {
    SUBMITTED: [RequisitionStatus.APPROVED, RequisitionStatus.REJECTED],
    APPROVED: [RequisitionStatus.PAID],
    PAID: [RequisitionStatus.COMPLETED],
    REJECTED: [],
    COMPLETED: [],
  }

  if (!validTransitions[requisition.status].includes(newStatus)) {
    return {
      success: false,
      message: "Invalid status transition.",
    }
  }

  // Require rejection reason
  if (newStatus === RequisitionStatus.REJECTED && !rejectionReason?.trim()) {
    return {
      success: false,
      message: "A rejection reason is required.",
    }
  }

  const data: Prisma.RequisitionUpdateInput = {
    status: newStatus,
  }

  switch (newStatus) {
    case RequisitionStatus.APPROVED:
      data.approvedBy = {
        connect: { id: user.id },
      }
      data.approvedAt = new Date()
      break

    case RequisitionStatus.REJECTED:
      data.rejectionReason = rejectionReason!.trim()
      break

    case RequisitionStatus.PAID:
      data.paidBy = {
        connect: { id: user.id },
      }
      data.paidAt = new Date()
      break

    case RequisitionStatus.COMPLETED:
      break
  }

  await prisma.requisition.update({
    where: { id },
    data,
  })

  const statusLabel = newStatus.toLowerCase()

  const notificationTitle = `Requisition ${statusLabel}`

  const notificationMessage =
    newStatus === RequisitionStatus.APPROVED
      ? `Your requisition "${requisition.title}" has been approved.`
      : newStatus === RequisitionStatus.REJECTED
        ? `Your requisition "${requisition.title}" was rejected.${rejectionReason ? ` Reason: ${rejectionReason.trim()}` : ""}`
        : `Your requisition "${requisition.title}" is now ${statusLabel}.`

  await createNotification({
    userId: requisition.requestedById,
    title: notificationTitle,
    message: notificationMessage,
    type:
      newStatus === RequisitionStatus.APPROVED
        ? "SUCCESS"
        : newStatus === RequisitionStatus.REJECTED
          ? "WARNING"
          : "INFO",
    link: "/dashboard/requisitions",
  })

  revalidatePath("/dashboard/requisitions")

  return {
    success: true,
    message: `Requisition ${statusLabel} successfully.`,
  }
}
// get all requisitions
export async function getRequisitions() {
  const user = await getCurrentUser()
  if (!user) redirect("/login")

  let whereClause: Prisma.RequisitionWhereInput = {}

  switch (user.role) {
    case "ADMIN":
      break
    case "FINANCE":
      whereClause = {
        OR: [
          { requestedById: user.id },
          { amount: { gt: 0 }, status: RequisitionStatus.APPROVED },
          {
            status: {
              in: [RequisitionStatus.PAID, RequisitionStatus.COMPLETED],
            },
          },
        ],
      }
      break

    case "WORKER":
    case "USER":
      whereClause = { requestedById: user.id }
      break

    default:
      throw new Error("Unauthorised role")
  }

  return prisma.requisition.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
    include: {
      requestedBy: { select: { id: true, name: true, role: true } },
      approvedBy: { select: { id: true, name: true, role: true } },
      paidBy: { select: { id: true, name: true, role: true } },
      department: { select: { id: true, name: true } },
    },
  })
}
