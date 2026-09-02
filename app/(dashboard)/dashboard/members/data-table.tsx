"use client"

import React from "react"

import {
  ColumnDef,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { usePathname, useRouter } from "next/navigation"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  total: number
  currentPage: number
  totalPages: number
  query: string
}

export function DataTable<TData, TValue>({
  columns,
  data,
  total,
  currentPage,
  totalPages,
  query,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [search, setSearch] = React.useState(query)
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const router = useRouter()
  const pathname = usePathname()

  const buildUrl = React.useCallback(
    (nextPage: number, nextQuery: string) => {
      const params = new URLSearchParams()
      if (nextPage > 1) params.set("page", String(nextPage))
      if (nextQuery) params.set("q", nextQuery)
      const qs = params.toString()
      return pathname + (qs ? `?${qs}` : "")
    },
    [pathname]
  )

  const applySearch = React.useCallback(
    (value: string) => {
      setSearch(value)
      const trimmed = value.trim()
      router.replace(buildUrl(1, trimmed))
    },
    [router, buildUrl]
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnVisibility,
    },
  })

  const from = total === 0 ? 0 : (currentPage - 1) * data.length + 1
  const to = (currentPage - 1) * data.length + data.length

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Search by first name, surname or email..."
          value={search}
          onChange={(event) => applySearch(event.target.value)}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="ml-auto text-black dark:text-white"
            >
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader className="bg-muted-foreground">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={
                        (
                          header.column.columnDef.meta as
                            | { responsiveClass?: string }
                            | undefined
                        )?.responsiveClass
                      }
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={
                        (
                          cell.column.columnDef.meta as
                            | { responsiveClass?: string }
                            | undefined
                        )?.responsiveClass
                      }
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between gap-2 py-4">
        <p className="text-sm text-muted-foreground">
          Showing {from}–{to} of {total}
        </p>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(buildUrl(currentPage - 1, query))}
            disabled={currentPage <= 1}
            className="text-black dark:text-white"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(buildUrl(currentPage + 1, query))}
            disabled={currentPage >= totalPages}
            className="text-black dark:text-white"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
