import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function MemberDetailSkeleton() {
  return (
    <div className="relative min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
        {/* HERO SECTION */}
        <Card className="relative overflow-hidden border-0 shadow-xl">
          {/* Edit button top-right */}
          <div className="absolute top-4 right-4 z-10">
            <Skeleton className="h-9 w-28 rounded-lg" />
          </div>

          <div className="absolute inset-0 bg-linear-to-r from-primary/10 via-primary/5 to-transparent" />
          <CardContent className="relative p-6 sm:p-8">
            <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
              <Skeleton className="h-28 w-28 shrink-0 rounded-full sm:h-32 sm:w-32" />

              <div className="flex-1 space-y-3 text-center md:text-left">
                <Skeleton className="h-8 w-56 sm:h-9 sm:w-72" />
                <div className="mt-2 space-y-2">
                  <Skeleton className="mx-auto h-4 w-48 md:mx-0" />
                  <Skeleton className="mx-auto h-4 w-56 md:mx-0" />
                  <Skeleton className="mx-auto h-4 w-40 md:mx-0" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* QUICK STATS GRID */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="border-0 shadow-lg">
              <CardContent className="space-y-3 p-5">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-5 rounded-md" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-5 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* TWO COLUMN LAYOUT */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* LEFT COLUMN */}
          <div className="space-y-6">
            {/* Spiritual Journey */}
            <Card className="overflow-hidden border-0 shadow-lg">
              <CardHeader className="bg-muted/30">
                <CardTitle className="flex items-center gap-2">
                  <Skeleton className="h-5 w-5 rounded-md" />
                  <Skeleton className="h-5 w-40" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="grid gap-3 sm:grid-cols-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-lg bg-muted/30 p-3"
                    >
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4 rounded-md" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Fellowship Groups */}
            <Card className="overflow-hidden border-0 shadow-lg">
              <CardHeader className="bg-muted/30">
                <CardTitle className="flex items-center gap-2">
                  <Skeleton className="h-5 w-5 rounded-md" />
                  <Skeleton className="h-5 w-44" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-6">
                {Array.from({ length: 2 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-lg" />
                ))}
              </CardContent>
            </Card>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">
            {/* Discipline Record */}
            <Card className="overflow-hidden border-0 shadow-lg">
              <CardHeader className="bg-muted/30">
                <CardTitle className="flex items-center gap-2">
                  <Skeleton className="h-5 w-5 rounded-md" />
                  <Skeleton className="h-5 w-40" />
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="mb-4 flex items-center justify-between rounded-lg bg-muted/30 p-3">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 rounded-md" />
                    <Skeleton className="h-3 w-36" />
                  </div>
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
              </CardContent>
            </Card>

            {/* Signatures */}
            <Card className="overflow-hidden border-0 shadow-lg">
              <CardHeader className="bg-muted/30">
                <CardTitle className="flex items-center gap-2">
                  <Skeleton className="h-5 w-5 rounded-md" />
                  <Skeleton className="h-5 w-40" />
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 pt-6 sm:grid-cols-2">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="space-y-3 rounded-lg border p-4">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4 rounded-md" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="h-5 w-full" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CHILDREN SECTION - Full Width */}
        <Card className="overflow-hidden border-0 shadow-lg">
          <CardHeader className="bg-muted/30">
            <CardTitle className="flex items-center gap-2">
              <Skeleton className="h-5 w-5 rounded-md" />
              <Skeleton className="h-5 w-32" />
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 pt-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-28 w-full rounded-lg" />
            ))}
          </CardContent>
        </Card>

        {/* DELETE BUTTON */}
        <div className="flex justify-end pt-4">
          <Skeleton className="h-10 w-36 rounded-lg" />
        </div>
      </div>
    </div>
  )
}
