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
      meta: { responsiveClass: "max-w-[7rem] truncate" },
      cell: ({ row }) => {
        const member = row.original
        return <div className="truncate">{member.surname}</div>
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
      meta: { responsiveClass: "max-w-[7rem] truncate" },
      cell: ({ row }) => (
        <div className="truncate">{row.original.firstName}</div>
      ),
    },

    {
      accessorKey: "email",
      header: "Email",
      meta: { responsiveClass: "hidden sm:table-cell" },
      cell: ({ row }) => {
        const email = row.getValue("email") as string
        return <span className="block max-w-[12rem] truncate">{email}</span>
      },
    },

    {
      accessorKey: "phoneNumber",
      header: "Phone Number",
      meta: { responsiveClass: "hidden sm:table-cell" },
      cell: ({ row }) => {
        const phone = row.getValue("phoneNumber") as string
        return <span className="block truncate">{phone}</span>
      },
    },

    {
      accessorKey: "gender",
      header: "Gender",
      meta: { responsiveClass: "hidden lg:table-cell" },
      cell: ({ row }) => {
        const gender = row.getValue("gender") as string
        return <span>{gender}</span>
      },
    },

    ...(isAdmin
      ? [
          {
            id: "actions",
            meta: { responsiveClass: "whitespace-nowrap" },
            cell: ({ row }) => {
              const member = row.original
              return <MemberActions {...member} />
            },
          } satisfies ColumnDef<Member>,
        ]
      : []),
  ]
}
