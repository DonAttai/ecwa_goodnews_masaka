import { Skeleton } from "@/components/ui/skeleton"

export default function UsersLoading() {
  return (
    <div className="container mx-auto space-y-6 py-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-4 w-56" />
        </div>

        <Skeleton className="h-10 w-36 rounded-md" />
      </div>

      {/* Table */}
      <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-4">
        {/* Search input */}
        <Skeleton className="h-9 w-64 max-w-full rounded-md" />

        {/* Table header */}
        <div className="border-b border-slate-200 bg-slate-50/50 px-4 py-3">
          <div className="grid grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-4 rounded" />
            ))}
          </div>
        </div>

        {/* Table rows */}
        <div className="divide-y divide-slate-100">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="px-4 py-4">
              <div className="grid grid-cols-5 gap-4">
                {Array.from({ length: 5 }).map((_, j) => (
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
