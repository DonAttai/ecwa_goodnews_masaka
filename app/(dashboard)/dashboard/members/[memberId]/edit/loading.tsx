import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function UpdateMemberFormSkeleton() {
  return (
    <div className="flex justify-center px-4">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <Skeleton className="h-7 w-64" />
        </CardHeader>

        <CardContent>
          <div className="space-y-8">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="space-y-4">
                {/* Section title */}
                <Skeleton className="h-5 w-44" />

                {/* Fields */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4">
            <Skeleton className="h-10 w-28 rounded-md" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
