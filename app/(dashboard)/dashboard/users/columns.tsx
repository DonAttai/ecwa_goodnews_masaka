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
  role: "USER" | "WORKER" | "FINANCE" | "ADMIN"
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
    cell: ({ row }) => (
      <span className="block truncate">{row.original.name}</span>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    meta: { responsiveClass: "hidden sm:table-cell" },
    cell: ({ row }) => {
      const email = row.getValue("email") as string
      return <span className="block max-w-48 truncate">{email}</span>
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
    header: "Department",
    meta: { responsiveClass: "hidden lg:table-cell" },
    cell: ({ row }) => {
      const department = row.getValue("department") as User["department"]
      return (
        <span className="truncate text-sm">{department?.name ?? "N/A"}</span>
      )
    },
  },
  {
    accessorKey: "isActive",
    header: "Status",
    meta: { responsiveClass: "" },
    cell: ({ row }) => {
      const isActive = row.getValue("isActive") as boolean

      return (
        <span>
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
    meta: { responsiveClass: "whitespace-nowrap" },
    cell: ({ row }) => {
      return <UserActions user={row.original} />
    },
  },
]
