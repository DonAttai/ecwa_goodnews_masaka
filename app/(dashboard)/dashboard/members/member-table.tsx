"use client"

import { getColumns, Member } from "./columns"
import { DataTable } from "./data-table"

interface Props {
  data: Member[]
  isAdmin: boolean
}
export default function MemberTable({ data, isAdmin }: Props) {
  return <DataTable columns={getColumns(isAdmin)} data={data} />
}
