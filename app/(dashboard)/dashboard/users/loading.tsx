import { Skeleton } from "@/components/ui/skeleton"
import { PageHeaderSkeleton } from "@/components/ui/page-header-skeleton"

export default function UsersLoading() {
  return (
    <div className="space-y-6">
      <PageHeaderSkeleton />

      {/* Table */}
      <div className="space-y-4 rounded-lg border border-border bg-card p-4">
        {/* Search input */}
        <Skeleton className="h-9 w-64 max-w-full rounded-md" />

        {/* Table header: name, email, role, department, status, actions */}
        <div className="border-b border-border bg-muted/50 px-4 py-3">
          <div className="grid grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-4 rounded" />
            ))}
          </div>
        </div>

        {/* Table rows */}
        <div className="divide-y divide-border">
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
