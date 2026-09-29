"use client"

import Link from "next/link"
import { CheckCircle2, Clock3, Banknote, CircleCheck, AlertCircle, LayoutGrid } from "lucide-react"
import { cn } from "@/lib/utils"

const STAGES = [
  { key: "SUBMITTED", label: "Submitted", icon: Clock3 },
  { key: "APPROVED", label: "Approved", icon: CheckCircle2 },
  { key: "PAID", label: "Paid", icon: Banknote },
  { key: "COMPLETED", label: "Completed", icon: CircleCheck },
] as const

export function PipelineBar({
  summary,
  active,
  basePath = "/dashboard/requisitions",
}: {
  summary: { submitted: number; approved: number; paid: number; completed: number; rejected: number; total: number }
  active?: string
  basePath?: string
}) {
  const counts: Record<string, number> = {
    SUBMITTED: summary.submitted,
    APPROVED: summary.approved,
    PAID: summary.paid,
    COMPLETED: summary.completed,
  }
  return (
    <nav aria-label="Requisition pipeline" className="rounded-2xl border border-border bg-card p-3 shadow-sm sm:p-4">
      <ol className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
        <li>
          <Link
            href={basePath}
            aria-current={!active ? "page" : undefined}
            className={cn(
              "flex h-full items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition",
              !active ? "border-primary/40 bg-primary/10 text-foreground" : "border-transparent text-muted-foreground hover:bg-muted/60 hover:text-foreground"
            )}
          >
            <LayoutGrid className="h-4 w-4" />
            All
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs tabular-nums">{summary.total}</span>
          </Link>
        </li>
        {STAGES.map((s, i) => {
          const isActive = active === s.key
          return (
            <li key={s.key} className="flex flex-1 items-stretch gap-2">
              <span aria-hidden className="hidden items-center text-border sm:flex">→</span>
              <Link
                href={`${basePath}?status=${s.key}`}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex flex-1 items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition",
                  isActive ? "border-primary/40 bg-primary/10 text-foreground" : "border-transparent text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                )}
              >
                <s.icon className="h-4 w-4 shrink-0" />
                <span className="hidden text-xs font-normal text-muted-foreground lg:inline">{i + 1}.</span>
                {s.label}
                <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-xs tabular-nums">{counts[s.key] ?? 0}</span>
              </Link>
            </li>
          )
        })}
        <li>
          <Link
            href={`${basePath}?status=REJECTED`}
            aria-current={active === "REJECTED" ? "page" : undefined}
            className={cn(
              "flex h-full items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition",
              active === "REJECTED"
                ? "border-rose-500/40 bg-rose-500/10 text-foreground"
                : "border-transparent text-muted-foreground hover:bg-muted/60 hover:text-foreground"
            )}
          >
            <AlertCircle className="h-4 w-4" />
            Rejected
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs tabular-nums">{summary.rejected}</span>
          </Link>
        </li>
      </ol>
    </nav>
  )
}
