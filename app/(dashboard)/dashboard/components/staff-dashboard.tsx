import { Role } from "@/lib/prisma"
import StaffFinanceDashboard from "./staff-finance-dashboard"
import StaffWorkerDashboard from "./staff-worker-dashboard"
import {
  getFinanceDashboardData,
  getWorkerDashboardData,
} from "../lib/dashboard-data"

interface StaffDashboardProps {
  role: Role
  name?: string
  departmentName?: string | null
}

/**
 * Role-aware dashboard for non-admin staff.
 *
 * FINANCE sees a requisition-focused view (they own the requisition workflow).
 * WORKER sees an operations/outreach overview. Each role only queries the data
 * it is permitted to see - no admin-only analytics are exposed here.
 */
export default async function StaffDashboard({
  role,
  name,
  departmentName,
}: StaffDashboardProps) {
  if (role === Role.FINANCE) {
    const data = await getFinanceDashboardData()
    return <StaffFinanceDashboard data={data} />
  }

  // WORKER (and any other non-admin staff default to the operations view)
  const data = await getWorkerDashboardData()
  return (
    <StaffWorkerDashboard
      data={data}
      userName={name}
      departmentName={departmentName}
    />
  )
}
