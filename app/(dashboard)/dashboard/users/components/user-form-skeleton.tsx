import { Skeleton } from "@/components/ui/skeleton"

// Lightweight placeholder shown for a single frame while the dialog shell
// paints, so the heavy RHF form can mount on the next frame without
// blocking the opening interaction (INP).
export function UserFormSkeleton() {
  return (
    <div className="space-y-5" aria-hidden="true">
      {[0, 1].map((i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-9 w-full" />
        </div>
      ))}
      <div className="space-y-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-4 w-48" />
      </div>
      <Skeleton className="h-11 w-full" />
    </div>
  )
}
