"use client"

import { DataTable } from "./data-table"
import { getColumns } from "./columns"
import { RequisitionItem } from "./types"

interface Props {
  data: RequisitionItem[]
  isAdmin: boolean
}

export default function RequisitionTable({ data, isAdmin }: Props) {
  return <DataTable columns={getColumns(isAdmin)} data={data} />
}
