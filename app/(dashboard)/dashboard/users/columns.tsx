"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"

import { UserActions } from "./components/user-actions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export type User = {
  id: string
  name: string
  email: string
  role: "WORKER" | "ADMIN" | "USER"
  isActive: boolean
  department?: { id: string; name: string } | null
}

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Full Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
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
    accessorKey: "department",
    header: () => <span className="hidden sm:table-cell">Department</span>,
    cell: ({ row }) => {
      const department = row.getValue("department") as User["department"]
      return (
        <span className="hidden text-sm sm:table-cell">
          {department?.name ?? "N/A"}
        </span>
      )
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
