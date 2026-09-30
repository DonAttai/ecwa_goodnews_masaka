import { PageHeaderSkeleton } from "@/components/ui/page-header-skeleton"

export default function Loading() {
  return (
    <div className="space-y-6">
      <PageHeaderSkeleton />

      {/* KPI strip: Pending review, Approved, Paid, Total requests */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="card-elevated p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 animate-pulse rounded bg-muted" />
              <div className="h-8 w-8 animate-pulse rounded-xl bg-muted" />
            </div>
            <div className="mt-2 h-9 w-16 animate-pulse rounded bg-muted" />
            <div className="mt-1 h-3 w-32 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>

      {/* Pipeline bar: All + 4 stages + Rejected */}
      <div className="rounded-2xl border border-border bg-card p-3 shadow-sm sm:p-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="h-12 flex-1 animate-pulse rounded-xl bg-muted"
            />
          ))}
        </div>
      </div>

      {/* Table: title, category, department, amount, priority, status, neededBy, actions */}
      <div>
        <div className="overflow-hidden rounded-md border">
          {/* Table Header */}
          <div className="border-b border-border bg-muted/50 px-6 py-3">
            <div className="grid grid-cols-8 gap-4">
              {[...Array(8)].map((_, index) => (
                <div
                  key={index}
                  className="h-4 animate-pulse rounded bg-muted"
                />
              ))}
            </div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-border">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="px-6 py-4">
                <div className="grid grid-cols-8 gap-4">
                  {[...Array(8)].map((_, colIndex) => (
                    <div
                      key={colIndex}
                      className="h-4 animate-pulse rounded bg-muted"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination: Showing X–Y of Z + Previous/Next */}
        <div className="flex items-center justify-between gap-2 py-4">
          <div className="h-4 w-32 animate-pulse rounded bg-muted" />
          <div className="flex items-center space-x-2">
            <div className="h-8 w-20 animate-pulse rounded-md bg-muted" />
            <div className="h-8 w-20 animate-pulse rounded-md bg-muted" />
          </div>
        </div>
      </div>
    </div>
  )
}
