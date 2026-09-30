import { Skeleton } from "@/components/ui/skeleton"
import { PageHeaderSkeleton } from "@/components/ui/page-header-skeleton"

export default function Loading() {
  return (
    <div className="space-y-6">
      <PageHeaderSkeleton />

      {/* Identity hero with overlapping avatar */}
      <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
        <div className="bg-linear-to-br from-[#f3e8cd] via-[#faf5ea] to-[#ffffff] px-6 pt-6 pb-16 sm:px-8 dark:from-[#1a2332] dark:via-[#22304a] dark:to-[#2f4362]">
          <Skeleton className="h-6 w-24 rounded-full bg-[#1a2332]/10 dark:bg-white/20" />
        </div>
        <div className="px-6 pb-6 sm:px-8">
          <Skeleton className="-mt-12 h-24 w-24 rounded-full sm:h-28 sm:w-28" />
          <Skeleton className="mt-4 h-8 w-56" />
          <Skeleton className="mt-2 h-5 w-72 max-w-full" />
        </div>
      </div>

      {/* Account Information: Full Name, Department, Role, Added On */}
      <section>
        <Skeleton className="mb-4 h-6 w-52" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border bg-muted/30 p-5"
            >
              <Skeleton className="h-3 w-24" />
              <Skeleton className="mt-4 h-6 w-40" />
            </div>
          ))}
        </div>
      </section>

      {/* Security */}
      <section>
        <Skeleton className="mb-4 h-6 w-36" />
        <div className="rounded-2xl border border-border bg-muted/30 p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-3">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-10 w-40 rounded-md" />
          </div>
        </div>
      </section>

      {/* Notifications */}
      <section>
        <Skeleton className="mb-4 h-6 w-44" />
        <div className="rounded-2xl border border-border bg-muted/30 p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-3">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-64 max-w-full" />
            </div>
            <Skeleton className="h-10 w-24 rounded-full" />
          </div>
        </div>
      </section>
    </div>
  )
}
