import { getCurrentUser } from "@/app/actions/auth"
import { redirect } from "next/navigation"
import { Clock3, CheckCircle2, Banknote, Wallet } from "lucide-react"
import { getRequisitions } from "./actions"
import RequisitionForm from "./components/requisition-form"
import RequisitionTable from "./requisition-table"
import { PipelineBar } from "./pipeline-bar"
import { PageHeader } from "@/components/ui/page-header"
import { RequisitionStatus } from "@/generated/prisma/enums"

const PAGE_SIZE = 20
const VALID_STATUS = ["SUBMITTED", "APPROVED", "PAID", "COMPLETED", "REJECTED"] as const

export default async function RequisitionsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string }>
}) {
  const [user, params] = await Promise.all([getCurrentUser(), searchParams])

  if (!user) redirect("/login")

  // EDITOR has no requisition access at all
  if (user.role === "EDITOR") redirect("/dashboard")

  const page = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1)
  const status = VALID_STATUS.includes(params.status as (typeof VALID_STATUS)[number])
    ? (params.status as RequisitionStatus)
    : undefined

  const { items, total, totalPages, summary } = await getRequisitions(page, PAGE_SIZE, status)

  const currentPage = Math.min(page, totalPages)

  const formatteRequisitions = items.map((item) => ({
    ...item,
    amount: item.amount?.toNumber() ?? null,
    neededBy: item.neededBy?.toISOString() ?? null,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
    approvedAt: item.approvedAt?.toISOString() ?? null,
    paidAt: item.paidAt?.toISOString() ?? null,
  }))

  const kpis = [
    { title: "Pending review", value: summary.submitted, icon: Clock3, hint: "Submitted awaiting action" },
    { title: "Approved", value: summary.approved, icon: CheckCircle2, hint: "Ready for finance" },
    { title: "Paid", value: summary.paid, icon: Banknote, hint: "Awaiting completion" },
    { title: "Total requests", value: summary.total, icon: Wallet, hint: "All time visible to you" },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Finance"
        title="Requisitions"
        description={
          status
            ? `Filtered by ${status.toLowerCase()} • ${total} ${total === 1 ? "request" : "requests"}`
            : `${summary.submitted} pending • ${summary.total} total`
        }
        actions={<RequisitionForm />}
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.title} className="card-elevated p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">{k.title}</p>
              <span className="rounded-xl bg-primary/12 p-2 text-primary-deep dark:text-[#e8d5a3]">
                <k.icon className="h-4 w-4" aria-hidden />
              </span>
            </div>
            <p className="mt-2 text-3xl font-bold tracking-tight tabular-nums">{k.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{k.hint}</p>
          </div>
        ))}
      </div>

      <PipelineBar summary={summary} active={status} />

      <RequisitionTable
        data={formatteRequisitions}
        role={user.role}
        total={total}
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </div>
  )
}
