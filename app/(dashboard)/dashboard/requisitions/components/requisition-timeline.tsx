import { Check, Clock, X } from "lucide-react"
import { RequisitionItem } from "../types"
import { cn } from "@/lib/utils"

type Step = {
  label: string
  detail?: string
  date?: string | Date | null
  state: "done" | "current" | "todo" | "blocked"
}

function fmt(d: string | Date | null | undefined): string | undefined {
  if (!d) return undefined
  return new Date(d).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

/** Status journey derived from existing timestamp fields — no extra queries. */
export default function RequisitionTimeline({
  requisition,
}: {
  requisition: RequisitionItem
}) {
  const rejected = requisition.status === "REJECTED"

  const steps: Step[] = [
    {
      label: "Submitted",
      detail: `by ${requisition.requestedBy.name}`,
      date: requisition.createdAt,
      state: "done",
    },
    {
      label: "Approved",
      detail: requisition.approvedBy
        ? `by ${requisition.approvedBy.name}`
        : "Awaiting admin review",
      date: requisition.approvedAt,
      state: rejected
        ? "blocked"
        : requisition.approvedAt
          ? "done"
          : "current",
    },
  ]

  if (rejected) {
    steps.push({
      label: "Rejected",
      detail: requisition.rejectionReason ?? undefined,
      date: requisition.updatedAt,
      state: "blocked",
    })
  } else {
    steps.push(
      {
        label: "Paid",
        detail: requisition.paidBy
          ? `by ${requisition.paidBy.name}`
          : "Awaiting finance",
        date: requisition.paidAt,
        state: requisition.paidAt
          ? "done"
          : requisition.approvedAt
            ? "current"
            : "todo",
      },
      {
        label: "Completed",
        date:
          requisition.status === "COMPLETED" ? requisition.updatedAt : null,
        state: requisition.status === "COMPLETED" ? "done" : "todo",
      }
    )
  }

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-muted-foreground">
        Request timeline
      </h4>
      <ol className="space-y-0">
        {steps.map((s, i) => (
          <li key={s.label} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  "flex size-7 items-center justify-center rounded-full border",
                  s.state === "done" &&
                    "border-emerald-500 bg-emerald-500 text-white",
                  s.state === "current" &&
                    "border-primary bg-primary text-primary-foreground",
                  s.state === "todo" &&
                    "border-border bg-muted text-muted-foreground",
                  s.state === "blocked" &&
                    "border-rose-500 bg-rose-500 text-white"
                )}
              >
                {s.state === "done" ? (
                  <Check className="size-4" />
                ) : s.state === "blocked" ? (
                  <X className="size-4" />
                ) : (
                  <Clock className="size-4" />
                )}
              </span>
              {i < steps.length - 1 && (
                <span
                  className={cn(
                    "w-px flex-1",
                    s.state === "done" ? "bg-emerald-500" : "bg-border"
                  )}
                />
              )}
            </div>
            <div className="pb-5">
              <p className="text-sm font-semibold">{s.label}</p>
              {s.detail && (
                <p className="text-sm text-muted-foreground">{s.detail}</p>
              )}
              {fmt(s.date) && (
                <p className="text-xs text-muted-foreground">{fmt(s.date)}</p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
