import { Role } from "@/lib/prisma"
import { getCurrentUser } from "@/app/actions/auth"

export default async function DashboardLoading() {
  const currentUser = await getCurrentUser()

  const role = currentUser?.role

  if (role === Role.WORKER) return <WorkerSkeleton />
  if (role === Role.FINANCE) return <FinanceSkeleton />
  if (role === Role.USER) return <UserSkeleton />
  return <AdminSkeleton />
}

/* ------------------------------------------------------------------ */
/* Shared bits                                                         */
/* ------------------------------------------------------------------ */

function StatCardSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="absolute top-0 left-0 h-1 w-12 bg-slate-200" />
      <div className="flex items-center justify-between">
        <div className="h-4 w-24 animate-pulse rounded bg-[#e5e0d8]" />
        <div className="h-9 w-9 animate-pulse rounded-xl bg-[#e5e0d8]" />
      </div>
      <div className="mt-4 h-8 w-28 animate-pulse rounded-xl bg-[#e5e0d8]" />
    </div>
  )
}

function HeroSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-linear-to-br from-[#1a2332] via-[#22304a] to-[#2f4362] p-6 sm:p-8">
      <div className="h-3 w-40 animate-pulse rounded bg-white/20" />
      <div className="mt-3 h-8 w-72 animate-pulse rounded-xl bg-white/20" />
      <div className="mt-3 h-4 w-56 animate-pulse rounded bg-white/15" />
    </div>
  )
}

function CardListSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="border-b border-border p-5">
        <div className="h-5 w-48 animate-pulse rounded bg-[#e5e0d8]" />
      </div>
      <div className="space-y-4 p-5">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-2/3 animate-pulse rounded bg-[#e5e0d8]" />
            <div className="h-3 w-1/3 animate-pulse rounded bg-[#e5e0d8]" />
          </div>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* ADMIN: hero + 2 stat rows + analytics/activity grid                 */
/* ------------------------------------------------------------------ */

function AdminSkeleton() {
  return (
    <div className="space-y-6">
      <HeroSkeleton />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={`secondary-${i}`} />
        ))}
      </div>

      <div className="grid gap-6 pb-12 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <CardListSkeleton rows={4} />
        </div>
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card shadow-sm">
            <div className="border-b border-border p-5">
              <div className="h-5 w-40 animate-pulse rounded bg-[#e5e0d8]" />
            </div>
            <div className="space-y-4 p-5">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-8 w-8 animate-pulse rounded-full bg-[#e5e0d8]" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-3/4 animate-pulse rounded bg-[#e5e0d8]" />
                    <div className="h-3 w-1/2 animate-pulse rounded bg-[#e5e0d8]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* WORKER: hero + 1 stat row + 3-col grid (fellowship / zones)         */
/* ------------------------------------------------------------------ */

function WorkerSkeleton() {
  return (
    <div className="space-y-6">
      <HeroSkeleton />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>

      <div className="grid gap-6 pb-12 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <CardListSkeleton rows={4} />
        </div>
        <div className="space-y-6">
          <CardListSkeleton rows={3} />
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="mb-4 h-5 w-32 animate-pulse rounded bg-[#e5e0d8]" />
            <div className="space-y-3">
              <div className="h-10 w-full animate-pulse rounded-lg bg-[#e5e0d8]" />
              <div className="h-10 w-full animate-pulse rounded-lg bg-[#e5e0d8]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* FINANCE: no hero + 2 stat rows + needs-attention grid               */
/* ------------------------------------------------------------------ */

function FinanceSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={`secondary-${i}`} />
        ))}
      </div>

      <div className="grid gap-6 pb-12 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <CardListSkeleton rows={4} />
        </div>
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="mb-4 h-5 w-40 animate-pulse rounded bg-[#e5e0d8]" />
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i}>
                  <div className="mb-1 h-3 w-3/4 animate-pulse rounded bg-[#e5e0d8]" />
                  <div className="h-2 w-full animate-pulse rounded-full bg-[#e5e0d8]" />
                </div>
              ))}
            </div>
          </div>
          <div className="h-10 w-full animate-pulse rounded-lg bg-[#e5e0d8]" />
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* USER: hero + 4 info tiles + quick actions                           */
/* ------------------------------------------------------------------ */

function UserSkeleton() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-6">
      <HeroSkeleton />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-card p-5 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="h-9 w-9 animate-pulse rounded-lg bg-[#e5e0d8]" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-20 animate-pulse rounded bg-[#e5e0d8]" />
                <div className="h-5 w-24 animate-pulse rounded bg-[#e5e0d8]" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <CardListSkeleton rows={3} />
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="mb-4 h-5 w-44 animate-pulse rounded bg-[#e5e0d8]" />
          <div className="space-y-3">
            <div className="h-12 w-full animate-pulse rounded-lg bg-[#e5e0d8]" />
            <div className="h-12 w-full animate-pulse rounded-lg bg-[#e5e0d8]" />
            <div className="h-12 w-full animate-pulse rounded-lg bg-[#e5e0d8]" />
          </div>
        </div>
      </div>
    </div>
  )
}
