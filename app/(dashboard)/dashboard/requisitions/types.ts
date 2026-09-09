import { RequisitionPriority, Role } from "@/generated/prisma/enums"
import { RequisitionStatus } from "@/generated/prisma/enums"
export interface RequisitionItem {
  id: string
  title: string
  description: string | null
  category: string
  amount?: number | null
  currency: string
  priority: RequisitionPriority
  status: RequisitionStatus
  neededBy: string | null
  createdAt: string
  updatedAt: string
  approvedAt: string | null
  paidAt: string | null
  requestedBy: {
    id: string
    name: string
    role: string
  }
  approvedBy: {
    id: string
    name: string
    role: string
  } | null
  paidBy: {
    id: string
    name: string
    role: string
  } | null
  department: {
    id: string
    name: string
  } | null
  rejectionReason: string | null
  receiptUrl: string | null
}

export type Status = (typeof RequisitionStatus)[keyof typeof RequisitionStatus]
export type Priority =
  (typeof RequisitionPriority)[keyof typeof RequisitionPriority]
export type roles = Role
