"use client"

import { ColumnDef } from "@tanstack/react-table"

import { UserActions } from "./components/user-actions"

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
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "isActive",
    header: "Active",
    cell: ({ row }) => {
      const isActive = row.getValue("isActive")
      return isActive ? "Yes" : "No"
    },
  },

  {
    id: "actions",
    cell: ({ row }) => {
      return <UserActions user={row.original} />
    },
  },
]
