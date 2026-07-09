export default function Loading() {
  return (
    <div className="space-y-6 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
      {/* Summary Cards Skeleton */}
      <div className="rounded-2xl border border-slate-200 bg-linear-to-br from-slate-50 via-white to-slate-50 p-4 shadow-sm sm:p-6">
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm"
            >
              <div className="h-8 w-8 animate-pulse rounded-lg bg-slate-200" />
              <div className="mt-3 h-4 w-20 animate-pulse rounded bg-slate-200" />
              <div className="mt-1 h-8 w-16 animate-pulse rounded bg-slate-200" />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {/* Action Button Skeleton */}
        <div className="flex justify-end">
          <div className="w-full sm:w-90">
            <div className="h-10 w-full animate-pulse rounded-lg bg-slate-200" />
          </div>
        </div>

        {/* Table Skeleton */}
        <div className="-mx-4 overflow-x-auto sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <div className="rounded-lg border border-slate-200 bg-white">
              {/* Table Header */}
              <div className="border-b border-slate-200 bg-slate-50/50 px-6 py-3">
                <div className="grid grid-cols-6 gap-4">
                  {[...Array(6)].map((_, index) => (
                    <div
                      key={index}
                      className="h-4 animate-pulse rounded bg-slate-200"
                    />
                  ))}
                </div>
              </div>

              {/* Table Rows */}
              <div className="divide-y divide-slate-100">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="px-6 py-4">
                    <div className="grid grid-cols-6 gap-4">
                      {[...Array(6)].map((_, colIndex) => (
                        <div
                          key={colIndex}
                          className="h-4 animate-pulse rounded bg-slate-200"
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
