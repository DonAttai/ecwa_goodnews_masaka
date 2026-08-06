import { Role } from "@/lib/prisma"

export interface LayoutUser {
  email: string
  role: Role
  name: string
}
