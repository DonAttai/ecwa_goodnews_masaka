import { Skeleton } from "@/components/ui/skeleton"

// Lightweight placeholder for the scrollable details body, shown for a
// single frame while the dialog shell paints, so the heavy content
// (ScrollArea + details grid + action panels) can mount on the next frame
// without blocking the opening interaction (INP).
export function RequisitionDetailsSkeleton() {
  return (
    <div className="space-y-8 p-8" aria-hidden="true">
      <div className="space-y-3">
        <Skeleton className="h-4 w-36" />
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      </div>
      <div className="space-y-3">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-24 w-full rounded-xl" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-10 w-full rounded-xl" />
        <Skeleton className="h-10 w-full rounded-xl" />
      </div>
    </div>
  )
}
