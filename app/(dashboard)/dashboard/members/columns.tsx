"use client"

import { Gender, MaritalStatus } from "@/lib/prisma"
import { ColumnDef } from "@tanstack/react-table"

import { ArrowUpDown } from "lucide-react"

import { MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type Member = {
  id: string
  passportUrl?: string | null
  surname: string
  firstName: string
  otherNames?: string | null
  gender?: Gender | null
  presentAddress?: string | null
  phoneNumber?: string | null
  email?: string | null
  maritalStatus?: MaritalStatus | null
  spouseName?: string | null
  stateOfOrigin?: string | null
  lga?: string | null
  tribe?: string | null
  previousPlaceOfWorship?: string | null
  homeCell?: string | null
  zone?: string | null
  preferredFellowshipGroup?: string | null
  fellowshipGroupId?: string | null
  acceptedChrist: boolean
  baptized: boolean
  baptismPlace?: string | null
  baptizedBy?: string | null
  communicant: boolean
  previousChurchPosition?: string | null
  recommendations?: string | null
  memberSignatureUrl?: string | null
  memberSignedAt?: Date | null
  pastorSignatureUrl?: string | null
  pastorSignedAt?: Date | null
  departmentId?: string | null
}

export const columns: ColumnDef<Member>[] = [
  {
    accessorKey: "firstName",
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
    cell: ({ row }) => {
      const member = row.original
      return (
        <div>
          {member.firstName} {member.otherNames} {member.surname}
        </div>
      )
    },
  },

  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
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
    accessorKey: "zone",
    header: "Zone",
  },

  {
    accessorKey: "gender",
    header: "Gender",
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const member = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(member.id)}
            >
              Copy Member ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View Member</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
