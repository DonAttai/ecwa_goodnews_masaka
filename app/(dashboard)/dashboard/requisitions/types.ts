import { RequisitionPriority } from "@/generated/prisma/enums"
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
  dueDate: Date | null
  createdAt: string | Date
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
  department: {
    id: string
    name: string
  } | null
  rejectionReason: string | null
}

export type Status = (typeof RequisitionStatus)[keyof typeof RequisitionStatus]
export type Priority =
  (typeof RequisitionPriority)[keyof typeof RequisitionPriority]
