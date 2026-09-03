"use client"

import { DataTable } from "./data-table"
import { getColumns } from "./columns"
import { RequisitionItem, roles } from "./types"

interface Props {
  data: RequisitionItem[]
  role: roles
  total: number
  currentPage: number
  totalPages: number
}

export default function RequisitionTable({
  data,
  role,
  total,
  currentPage,
  totalPages,
}: Props) {
  return (
    <DataTable
      columns={getColumns(role)}
      data={data}
      total={total}
      currentPage={currentPage}
      totalPages={totalPages}
    />
  )
}
