"use client"

import { DataTable } from "./data-table"
import { getUserColumns, type User } from "./columns"

// Client wrapper so the column factory (which closes over client action
// components) runs on the client. Calling getUserColumns() from a Server
// Component throws: "Attempted to call ... from the server but it is on
// the client".
export default function UserTable({
  users,
  departments,
  total,
  currentPage,
  totalPages,
  query,
}: {
  users: User[]
  departments: Array<{ id: string; name: string }>
  total: number
  currentPage: number
  totalPages: number
  query: string
}) {
  return (
    <DataTable
      columns={getUserColumns(departments)}
      data={users}
      total={total}
      currentPage={currentPage}
      totalPages={totalPages}
      query={query}
    />
  )
}
