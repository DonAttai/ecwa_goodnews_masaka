"use client"

import { ColumnDef } from "@tanstack/react-table"
import { RequisitionItem } from "./types"
import { ValueBadge } from "./components/value-badge"
import { PRIORITY_CLASSES, STATUS_CLASSES } from "./constants/badge-classes"
import RequisitionActions from "./components/requisition-actions"

export function getColumns(isAdmin: boolean): ColumnDef<RequisitionItem>[] {
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
      accessorKey: "amount",
      header: () => <div>Amount (NGN)</div>,
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
      header: () => <span className="hidden sm:table-cell">Status-</span>,
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
      accessorKey: "dueDate",
      header: () => <span className="hidden sm:table-cell">Due Date</span>,
      cell: ({ row }) => {
        const date = row.getValue<Date | null>("dueDate")
        const dueDate = date ? new Date(date) : null

        return (
          <div className="hidden font-medium sm:table-cell">
            {dueDate ? new Intl.DateTimeFormat("en-NG").format(dueDate) : "N/A"}
          </div>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <RequisitionActions requisition={row.original} isAdmin={isAdmin} />
      ),
    },
  ]
}
