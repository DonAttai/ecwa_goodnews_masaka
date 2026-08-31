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
      cell: ({ row }) => (
        <div className="max-w-[9rem] truncate sm:max-w-[12rem] lg:max-w-none">
          {row.original.title}
        </div>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
      meta: { responsiveClass: "hidden sm:table-cell" },
      cell: ({ row }) => {
        const category = row.getValue("category") as string
        return <span>{category}</span>
      },
    },
    {
      accessorKey: "department",
      header: "Department",
      meta: { responsiveClass: "hidden lg:table-cell" },
      cell: ({ row }) => {
        const department = row.getValue(
          "department"
        ) as RequisitionItem["department"]
        return <span className="truncate">{department?.name ?? "N/A"}</span>
      },
    },
    {
      accessorKey: "amount",
      header: () => <div>Amount(NGN)</div>,
      meta: { responsiveClass: "hidden sm:table-cell" },
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
      header: "Priority",
      meta: { responsiveClass: "hidden sm:table-cell" },
      cell: ({ row }) => {
        return (
          <span>
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
      header: "Status",
      meta: { responsiveClass: "" },
      cell: ({ row }) => {
        return (
          <span>
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
      header: "Needed By",
      meta: { responsiveClass: "hidden lg:table-cell" },
      cell: ({ row }) => {
        const date = row.getValue<Date | null>("neededBy")
        const neededBy = date ? new Date(date) : null

        return (
          <div className="font-medium">
            {neededBy
              ? new Intl.DateTimeFormat("en-NG").format(neededBy)
              : "N/A"}
          </div>
        )
      },
    },
    {
      id: "actions",
      meta: { responsiveClass: "whitespace-nowrap" },
      cell: ({ row }) => (
        <RequisitionActions requisition={row.original} role={role} />
      ),
    },
  ]
}
