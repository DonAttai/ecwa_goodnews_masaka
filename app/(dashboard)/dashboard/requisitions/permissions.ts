import { RequisitionStatus, Role } from "@/generated/prisma/enums"

export const requisitionStatusPermissions: Record<RequisitionStatus, Role[]> = {
  SUBMITTED: [],
  APPROVED: [Role.ADMIN],
  REJECTED: [Role.ADMIN, Role.FINANCE],
  PAID: [Role.ADMIN, Role.FINANCE],
  COMPLETED: [Role.ADMIN, Role.FINANCE],
}
