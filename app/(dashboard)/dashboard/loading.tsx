export default function DashboardLoading() {
  return (
    <div className="flex min-h-[calc(100vh-5rem)] flex-col p-4 sm:p-6 lg:p-8">
      {/* Header Skeleton */}
      <div className="mb-8 flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-64 animate-pulse rounded-xl bg-[#e5e0d8]" />
          <div className="h-4 w-40 animate-pulse rounded-lg bg-[#e5e0d8]" />
        </div>
        <div className="h-10 w-10 animate-pulse rounded-full bg-[#e5e0d8]" />
      </div>

      {/* Main Content Skeleton */}
      <div className="flex-1 space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-[#e2dcd5] bg-white p-6"
            >
              <div className="flex items-center justify-between">
                <div className="h-5 w-24 animate-pulse rounded bg-[#e5e0d8]" />
                <div className="h-8 w-8 animate-pulse rounded-lg bg-[#e5e0d8]" />
              </div>
              <div className="mt-6 h-10 w-32 animate-pulse rounded-xl bg-[#e5e0d8]" />
            </div>
          ))}
        </div>

        {/* Table / Main Content Area */}
        <div className="rounded-2xl border border-[#e2dcd5] bg-white p-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="h-6 w-48 animate-pulse rounded bg-[#e5e0d8]" />
            <div className="h-9 w-28 animate-pulse rounded-xl bg-[#e5e0d8]" />
          </div>

          {/* Table Rows */}
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 border-b border-[#f0e9df] py-3 last:border-0"
              >
                <div className="h-9 w-9 animate-pulse rounded-full bg-[#e5e0d8]" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 animate-pulse rounded bg-[#e5e0d8]" />
                  <div className="h-3 w-1/2 animate-pulse rounded bg-[#e5e0d8]" />
                </div>
                <div className="h-6 w-20 animate-pulse rounded-full bg-[#e5e0d8]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
