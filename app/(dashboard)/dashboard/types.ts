import { Role } from "@/lib/prisma"

export interface DashboardUser {
  id: string
  name: string
  email: string
  role: Role
  isActive?: boolean
  createdAt?: Date
  department?: {
    id: string
    name: string
  } | null
}

export interface LayoutUser {
  email: string
  role: Role
  name: string
  id?: string
}

export interface RecentRequisition {
  id: string
  title: string
  status: string
  createdAt: Date
}
