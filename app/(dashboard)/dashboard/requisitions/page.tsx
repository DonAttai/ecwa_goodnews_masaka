import { getCurrentUser } from "@/app/actions/auth"
import { redirect } from "next/navigation"
import {
  AlertCircle,
  Banknote,
  CheckCircle2,
  CircleCheck,
  ClipboardList,
  Clock3,
} from "lucide-react"
import { getRequisitions } from "./actions"
import RequisitionForm from "./components/requisition-form"
import RequisitionTable from "./requisition-table"

const PAGE_SIZE = 20

export default async function RequisitionsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const [user, params] = await Promise.all([getCurrentUser(), searchParams])

  if (!user) redirect("/login")

  const page = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1)

  const { items, total, totalPages, summary } = await getRequisitions(
    page,
    PAGE_SIZE
  )

  const currentPage = Math.min(page, totalPages)

  const formatteRequisitions = items.map((item) => ({
    ...item,
    amount: item.amount?.toNumber() ?? null,
  }))

  const summaryCards = [
    {
      title: "Total",
      value: summary.total,
      icon: ClipboardList,
      accent: "from-slate-700 to-slate-900",
    },
    {
      title: "Submitted",
      value: summary.submitted,
      icon: Clock3,
      accent: "from-amber-500 to-orange-500",
    },
    {
      title: "Approved",
      value: summary.approved,
      icon: CheckCircle2,
      accent: "from-emerald-500 to-green-600",
    },
    {
      title: "Paid",
      value: summary.paid,
      icon: Banknote,
      accent: "from-sky-500 to-cyan-600",
    },
    {
      title: "Completed",
      value: summary.completed,
      icon: CircleCheck,
      accent: "from-indigo-500 to-violet-600",
    },
    {
      title: "Rejected",
      value: summary.rejected,
      icon: AlertCircle,
      accent: "from-rose-500 to-red-600",
    },
  ]

  return (
    <div className="container mx-auto space-y-6 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
      <div className="rounded-2xl border border-slate-200 bg-linear-to-br from-slate-50 via-white to-slate-50 p-4 shadow-sm sm:p-6">
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => {
            const Icon = card.icon
            return (
              <div
                key={card.title}
                className="rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm"
              >
                <div
                  className={`inline-flex rounded-lg bg-linear-to-r ${card.accent} p-2 text-white`}
                >
                  <Icon className="size-4" />
                </div>
                <p className="mt-3 text-sm text-slate-500">{card.title}</p>
                <p className="text-2xl font-semibold text-slate-900">
                  {card.value}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      <div className="space-y-4">
        {/* Top section */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <p className="text-xl font-semibold">Requisitions</p>

          <div className="sm:ml-auto">
            <RequisitionForm />
          </div>
        </div>

        <RequisitionTable
          data={formatteRequisitions}
          role={user.role}
          total={total}
          currentPage={currentPage}
          totalPages={totalPages}
        />
      </div>
    </div>
  )
}
