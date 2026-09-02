import { Skeleton } from "@/components/ui/skeleton"

export default function MembersLoading() {
  return (
    <div className="space-y-4 px-4 py-4 sm:space-y-6 sm:px-6 sm:py-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
        <div className="space-y-2">
          <Skeleton className="h-8 w-36 sm:h-9" />
          <Skeleton className="h-4 w-48" />
        </div>

        <Skeleton className="h-9 w-36 self-start rounded-md sm:self-auto" />
      </div>

      {/* Table */}
      <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-4">
        {/* Search input */}
        <div className="flex items-center py-1">
          <Skeleton className="h-9 w-64 max-w-full rounded-md" />
        </div>

        {/* Table header */}
        <div className="border-b border-slate-200 bg-slate-50/50 px-4 py-3">
          <div className="grid grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-4 rounded" />
            ))}
          </div>
        </div>

        {/* Table rows */}
        <div className="divide-y divide-slate-100">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="px-4 py-4">
              <div className="grid grid-cols-6 gap-4">
                {Array.from({ length: 6 }).map((_, j) => (
                  <Skeleton key={j} className="h-4 rounded" />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-end gap-2 py-2">
          <Skeleton className="h-8 w-24 rounded-md" />
          <Skeleton className="h-8 w-24 rounded-md" />
        </div>
      </div>
    </div>
  )
}
