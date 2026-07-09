"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/app/actions/auth"
import { redirect } from "next/navigation"
import { requisitionSchema, RequisitionType } from "./schema"
import { RequisitionStatus } from "@/generated/prisma/enums"

export async function createRequisition(input: RequisitionType) {
  const user = await getCurrentUser()
  if (!user) redirect("/login")

  if (user.role !== "WORKER") {
    return {
      success: false,
      message: "Only workers can submit requisitions.",
    }
  }

  const parsed = requisitionSchema.safeParse(input)
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Invalid requisition",
    }
  }

  const data = parsed.data

  await prisma.requisition.create({
    data: {
      title: data.title,
      description: data.description ?? null,
      category: data.category,
      amount: data.amount,
      currency: data.currency,
      priority: data.priority,
      status: data.status ?? "PENDING",
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      requestedById: user.id,
    },
  })

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

  if (!user) {
    redirect("/login")
  }

  if (user.role !== "ADMIN") {
    return {
      success: false,
      message: "Only administrators can update requisition status.",
    }
  }

  const requisition = await prisma.requisition.findUnique({
    where: { id },
    select: {
      id: true,
      status: true,
      requestedById: true,
      approvedAt: true,
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
      message: "You cannot update the status of your own requisition.",
    }
  }

  // Prevent updating completed/rejected requisitions
  if (
    requisition.status === RequisitionStatus.COMPLETED ||
    requisition.status === RequisitionStatus.REJECTED
  ) {
    return {
      success: false,
      message: `Cannot update a ${requisition.status.toLowerCase()} requisition.`,
    }
  }

  // Prevent redundant updates
  if (requisition.status === newStatus) {
    return {
      success: false,
      message: `Requisition is already ${newStatus.toLowerCase()}.`,
    }
  }

  // Validate state transitions
  const validTransitions: Record<RequisitionStatus, RequisitionStatus[]> = {
    PENDING: [RequisitionStatus.APPROVED, RequisitionStatus.REJECTED],
    APPROVED: [RequisitionStatus.COMPLETED],
    REJECTED: [],
    COMPLETED: [],
  }

  if (!validTransitions[requisition.status].includes(newStatus)) {
    return {
      success: false,
      message: `Cannot change status from ${requisition.status.toLowerCase()} to ${newStatus.toLowerCase()}.`,
    }
  }

  // Require rejection reason
  if (newStatus === RequisitionStatus.REJECTED && !rejectionReason?.trim()) {
    return {
      success: false,
      message: "A rejection reason is required.",
    }
  }

  await prisma.requisition.update({
    where: {
      id,
    },
    data: {
      status: newStatus,

      approvedById:
        newStatus === RequisitionStatus.APPROVED ? user.id : undefined,

      // Preserve original approval date
      approvedAt:
        newStatus === RequisitionStatus.APPROVED && !requisition.approvedAt
          ? new Date()
          : undefined,

      rejectionReason:
        newStatus === RequisitionStatus.REJECTED
          ? rejectionReason!.trim()
          : null,
    },
  })

  revalidatePath("/dashboard/requisitions")

  return {
    success: true,
    message: `Requisition ${newStatus.toLowerCase()} successfully.`,
  }
}

// get all requisitions
export async function getRequisitions() {
  const user = await getCurrentUser()
  if (!user) redirect("/login")

  const requisitions = await prisma.requisition.findMany({
    where: user.role === "WORKER" ? { requestedById: user.id } : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      requestedBy: { select: { id: true, name: true, role: true } },
      approvedBy: { select: { id: true, name: true, role: true } },
    },
  })

  return requisitions
}
