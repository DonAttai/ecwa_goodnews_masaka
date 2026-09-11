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
}: {
  users: User[]
  departments: Array<{ id: string; name: string }>
}) {
  return <DataTable columns={getUserColumns(departments)} data={users} />
}
