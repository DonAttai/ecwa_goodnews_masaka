import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

type StatusKind =
  | "SUBMITTED"
  | "APPROVED"
  | "PAID"
  | "COMPLETED"
  | "REJECTED"
  | "ACTIVE"
  | "INACTIVE"
  | "PUBLISHED"
  | "DRAFT"
  | "ADMIN"
  | "FINANCE"
  | "ELDER"
  | "WORKER"
  | "PASTOR"
  | "EDITOR"

const styles: Record<string, string> = {
  SUBMITTED: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  APPROVED: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  PAID: "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300",
  COMPLETED: "border-indigo-500/30 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300",
  REJECTED: "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300",
  ACTIVE: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  INACTIVE: "border-border bg-muted text-muted-foreground",
  PUBLISHED: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  DRAFT: "border-border bg-muted text-muted-foreground",
  ADMIN: "border-[#c9a84c]/30 bg-[#c9a84c]/10 text-[#8a6d1b] dark:text-[#e8d5a3]",
  FINANCE: "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300",
  ELDER: "border-indigo-500/30 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300",
  WORKER: "border-border bg-muted text-muted-foreground",
  PASTOR: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  EDITOR: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
}

export function StatusBadge({
  status,
  className,
  dot = true,
}: {
  status: string
  className?: string
  dot?: boolean
}) {
  const key = status.toUpperCase()
  return (
    <Badge
      variant="outline"
      className={cn("gap-1.5 px-2.5 py-1 font-semibold normal-case", styles[key] ?? styles.WORKER, className)}
    >
      {dot && <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-current" />}
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </Badge>
  )
}

export type { StatusKind }
