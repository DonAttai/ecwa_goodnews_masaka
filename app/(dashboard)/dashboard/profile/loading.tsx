import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-3">
            <Skeleton className="h-10 w-56" />
            <Skeleton className="h-5 w-72" />
          </div>

          <Skeleton className="h-8 w-24 rounded-full" />
        </div>

        <Card className="overflow-hidden border-border shadow-2xl">
          {/* Profile Header */}
          <div className="bg-linear-to-r from-primary/20 via-primary/10 to-transparent p-8">
            <div className="flex flex-wrap items-center gap-6">
              <Skeleton className="h-28 w-28 rounded-full" />

              <div className="space-y-3">
                <Skeleton className="h-8 w-56" />
                <Skeleton className="h-5 w-72" />
              </div>
            </div>
          </div>

          <CardContent className="p-8">
            {/* Account Information */}
            <div className="mb-10">
              <Skeleton className="mb-5 h-6 w-48" />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
            </div>

            <div className="my-8 h-px bg-border" />

            {/* Security */}
            <div>
              <Skeleton className="mb-5 h-6 w-36" />

              <div className="rounded-2xl border border-border bg-muted/30 p-7">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-3">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-4 w-32" />
                  </div>

                  <Skeleton className="h-10 w-40 rounded-md" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
