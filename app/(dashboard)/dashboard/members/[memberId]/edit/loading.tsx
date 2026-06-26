import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function UpdateMemberFormSkeleton() {
  return (
    <div className="flex justify-center px-4">
      <Card className="w-full max-w-4xl">
        <CardContent className="space-y-6 py-8">
          <Skeleton className="h-8 w-1/4" />

          <div className="grid gap-6 md:grid-cols-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full md:col-span-2" />
          </div>

          <div className="flex justify-end gap-3">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-32" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
