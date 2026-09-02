"use client"

import { getColumns, Member } from "./columns"
import { DataTable } from "./data-table"

interface Props {
  data: Member[]
  isAdmin: boolean
  total: number
  currentPage: number
  totalPages: number
  query: string
}
export default function MemberTable({
  data,
  isAdmin,
  total,
  currentPage,
  totalPages,
  query,
}: Props) {
  return (
    <DataTable
      columns={getColumns(isAdmin)}
      data={data}
      total={total}
      currentPage={currentPage}
      totalPages={totalPages}
      query={query}
    />
  )
}
