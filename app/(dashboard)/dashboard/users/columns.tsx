"use client"

import { ColumnDef } from "@tanstack/react-table"

import { UserActions } from "./components/user-actions"
import { Badge } from "@/components/ui/badge"

export type User = {
  id: string
  name: string
  email: string
  role: "WORKER" | "ADMIN"
  isActive: boolean
}

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: () => <span className="hidden sm:table-cell">Email</span>,
    cell: ({ row }) => {
      const email = row.getValue("email") as string
      // Hide on mobile, show on sm screens and up
      return <span className="hidden sm:table-cell">{email}</span>
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role") as string
      return <span className="text-xs">{role}</span>
    },
  },
  {
    accessorKey: "isActive",
    header: () => <span className="hidden sm:table-cell">Status</span>,
    cell: ({ row }) => {
      const isActive = row.getValue("isActive") as boolean

      return (
        <span className="hidden sm:table-cell">
          {isActive ? (
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
              ACTIVE
            </Badge>
          ) : (
            <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
              INACTIVE
            </Badge>
          )}
        </span>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <UserActions user={row.original} />
    },
  },
]
