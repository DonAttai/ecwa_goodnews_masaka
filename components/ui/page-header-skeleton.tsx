import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

/**
 * Loading placeholder that mirrors PageHeader:
 * eyebrow + title + description on the left, action button on the right.
 */
export function PageHeaderSkeleton({
  className,
  actionClassName,
}: {
  className?: string
  actionClassName?: string
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        className
      )}
    >
      <div className="min-w-0 space-y-2">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-8 w-48 sm:h-9 sm:w-56" />
        <Skeleton className="h-4 w-64 max-w-full" />
      </div>
      <Skeleton className={cn("h-10 w-36 shrink-0 rounded-xl", actionClassName)} />
    </div>
  )
}
