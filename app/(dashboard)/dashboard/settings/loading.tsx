import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function SettingsLoading() {
  return (
    <div className="min-h-screen bg-background md:flex">
      {/* Sidebar - Desktop */}
      <div className="hidden w-72 shrink-0 border-r border-border bg-card/80 p-6 md:block">
        <div className="mb-10">
          <Skeleton className="h-10 w-10 rounded-xl" />
        </div>

        <nav className="space-y-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-xl px-4 py-3"
            >
              <Skeleton className="h-5 w-5 rounded-md" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-6 md:p-8">
        {/* Header */}
        <div className="mb-6 hidden md:block">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="mt-2 h-4 w-64" />
        </div>

        <div className="max-w-4xl">
          <Card>
            <CardContent className="p-6">
              {/* Logo upload row */}
              <div className="flex items-center gap-6 pb-6">
                <Skeleton className="h-24 w-24 rounded-lg" />
                <Skeleton className="h-10 w-36 rounded-md" />
              </div>

              {/* Form fields */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-10 w-full rounded-md" />
                  </div>
                ))}
                <div className="space-y-2 md:col-span-2">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-28 w-full rounded-md" />
                </div>
              </div>

              {/* Save button */}
              <div className="flex justify-end pt-6">
                <Skeleton className="h-10 w-32 rounded-md" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
