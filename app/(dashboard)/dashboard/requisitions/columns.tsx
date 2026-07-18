"use client"

import { ColumnDef } from "@tanstack/react-table"
import { RequisitionItem, roles } from "./types"
import { ValueBadge } from "./components/value-badge"
import { PRIORITY_CLASSES, STATUS_CLASSES } from "./constants/badge-classes"
import RequisitionActions from "./components/requisition-actions"

export function getColumns(role: roles): ColumnDef<RequisitionItem>[] {
  return [
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "category",
      header: () => <span className="hidden sm:table-cell">Category</span>,
      cell: ({ row }) => {
        const category = row.getValue("category") as string
        // Hide on mobile, show on sm screens and up
        return <span className="hidden sm:table-cell">{category}</span>
      },
    },
    {
      accessorKey: "department",
      header: () => <span className="hidden sm:table-cell">Department</span>,
      cell: ({ row }) => {
        const department = row.getValue(
          "department"
        ) as RequisitionItem["department"]
        return (
          <span className="hidden sm:table-cell">
            {department?.name ?? "N/A"}
          </span>
        )
      },
    },
    {
      accessorKey: "amount",
      header: () => <div>Amount(NGN)</div>,
      cell: ({ row }) => {
        const amount = Number(row.getValue("amount"))

        return (
          <div className="font-medium">
            {Number.isFinite(amount)
              ? new Intl.NumberFormat("en-NG").format(amount)
              : "N/A"}
          </div>
        )
      },
    },
    {
      accessorKey: "priority",
      header: () => <span className="hidden sm:table-cell">Priority</span>,
      cell: ({ row }) => {
        return (
          <span className="hidden sm:table-cell">
            <ValueBadge
              value={row.getValue("priority")}
              classes={PRIORITY_CLASSES}
            />
          </span>
        )
      },
    },
    {
      accessorKey: "status",
      header: () => <span className="hidden sm:table-cell">Status</span>,
      cell: ({ row }) => {
        return (
          <span className="hidden sm:table-cell">
            <ValueBadge
              value={row.getValue("status")}
              classes={STATUS_CLASSES}
            />
          </span>
        )
      },
    },
    {
      accessorKey: "neededBy",
      header: () => <span className="hidden sm:table-cell">Needed By</span>,
      cell: ({ row }) => {
        const date = row.getValue<Date | null>("neededBy")
        const neededBy = date ? new Date(date) : null

        return (
          <div className="hidden font-medium sm:table-cell">
            {neededBy
              ? new Intl.DateTimeFormat("en-NG").format(neededBy)
              : "N/A"}
          </div>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <RequisitionActions requisition={row.original} role={role} />
      ),
    },
  ]
}
