"use client"

import { ColumnDef } from "@tanstack/react-table"

import { ArrowUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"

import { MemberFormValues } from "./schemas"
import MemberActions from "./components/member-actions"

export type Member = MemberFormValues & { id: string }

export function getColumns(isAdmin: boolean): ColumnDef<Member>[] {
  return [
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
      accessorKey: "email",
      header: () => <span className="hidden sm:table-cell">Email</span>,
      cell: ({ row }) => {
        const email = row.getValue("email") as boolean
        // Hide on mobile, show on sm screens and up
        return <span className="hidden sm:table-cell">{email}</span>
      },
    },

    {
      accessorKey: "phoneNumber",
      header: () => <span className="hidden sm:table-cell">Phone Number</span>,
      cell: ({ row }) => {
        const phone = row.getValue("phoneNumber") as boolean
        // Hide on mobile, show on sm screens and up
        return <span className="hidden sm:table-cell">{phone}</span>
      },
    },

    {
      accessorKey: "gender",
      header: () => <span className="hidden sm:table-cell">Gender</span>,
      cell: ({ row }) => {
        const gender = row.getValue("gender") as boolean
        // Hide on mobile, show on sm screens and up
        return <span className="hidden sm:table-cell">{gender}</span>
      },
    },

    ...(isAdmin
      ? [
          {
            id: "actions",
            cell: ({ row }) => {
              const member = row.original
              return <MemberActions {...member} />
            },
          } satisfies ColumnDef<Member>,
        ]
      : []),
  ]
}
