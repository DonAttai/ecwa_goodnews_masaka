import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function CreateMemberLoading() {
  return (
    <div className="space-y-6">
      {/* Header with title and back button */}
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <Skeleton className="h-8 w-52" />
          <Skeleton className="h-4 w-80" />
        </div>

        <Skeleton className="h-9 w-36 rounded-md" />
      </div>

      {/* Wizard Card */}
      <Card className="mx-auto w-full max-w-5xl shadow-lg">
        <CardHeader className="border-b bg-linear-to-r from-primary/5 to-primary/10">
          <div className="mb-2 text-center">
            <Skeleton className="mx-auto mt-2 h-6 w-48" />
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          {/* Progress bar */}
          <div className="mb-8">
            <div className="mb-2 flex justify-between text-sm font-medium">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-3 w-full rounded-full" />
          </div>

          {/* Step indicator */}
          <div className="mb-8 overflow-x-auto">
            <div className="flex min-w-max gap-2">
              {Array.from({ length: 7 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 rounded-lg bg-muted px-4 py-2"
                >
                  <Skeleton className="h-4 w-4 rounded-md" />
                  <Skeleton className="hidden h-4 w-16 sm:inline" />
                </div>
              ))}
            </div>
          </div>

          {/* Form fields */}
          <div className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between border-t pt-6">
          <Skeleton className="h-10 w-28 rounded-md" />

          <div className="flex gap-2">
            <Skeleton className="h-10 w-24 rounded-md" />
            <Skeleton className="h-10 w-28 rounded-md" />
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
