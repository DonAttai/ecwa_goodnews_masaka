import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon: LucideIcon
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "mx-auto flex max-w-md flex-col items-center rounded-[1.75rem] border border-dashed border-border bg-card px-8 py-12 text-center",
        className
      )}
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/12 text-primary-deep dark:text-[#e8d5a3]">
        <Icon className="h-7 w-7" aria-hidden />
      </span>
      <p className="font-display mt-5 text-xl font-semibold text-balance">{title}</p>
      {description && <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
