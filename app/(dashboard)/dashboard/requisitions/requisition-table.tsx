"use client"

import { DataTable } from "./data-table"
import { getColumns } from "./columns"
import { RequisitionItem, roles } from "./types"

interface Props {
  data: RequisitionItem[]
  role: roles
}

export default function RequisitionTable({ data, role }: Props) {
  return <DataTable columns={getColumns(role)} data={data} />
}
