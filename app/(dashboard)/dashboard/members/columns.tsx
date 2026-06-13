"use client"

import { ColumnDef } from "@tanstack/react-table"

import { ArrowUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"

import { MemberFormValues } from "./schemas"
import MemberActions from "./components/member-actions"

export type Member = MemberFormValues & { id: string }

export const columns: ColumnDef<Member>[] = [
  {
    accessorKey: "surname",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Surname
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const member = row.original
      return <div>{member.surname}</div>
    },
  },

  {
    accessorKey: "firstName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          First Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone Number",
  },

  {
    accessorKey: "gender",
    header: "Gender",
    cell: ({ row }) => {
      const member = row.original
      return <div>{member.gender}</div>
    },
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const member = row.original
      return <MemberActions {...member} />
    },
  },
]
