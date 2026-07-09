import { getCurrentUser } from "@/app/actions/auth"
import { redirect } from "next/navigation"
import { AlertCircle, CheckCircle2, ClipboardList, Clock3 } from "lucide-react"
import { getRequisitions } from "./actions"
import RequisitionForm from "./components/requisition-form"
import RequisitionTable from "./requisition-table"

export default async function RequisitionsPage() {
  const [user, requisitions] = await Promise.all([
    getCurrentUser(),
    getRequisitions(),
  ])

  if (!user) redirect("/login")

  const isAdmin = user.role === "ADMIN"
  const canCreateRequisition = user.role === "WORKER"
  const summary = {
    total: requisitions.length,
    pending: requisitions.filter((item) => item.status === "PENDING").length,
    approved: requisitions.filter((item) =>
      ["APPROVED", "COMPLETED"].includes(item.status)
    ).length,
    rejected: requisitions.filter((item) => item.status === "REJECTED").length,
  }

  const summaryCards = [
    {
      title: "Total requests",
      value: summary.total,
      icon: ClipboardList,
      accent: "from-slate-700 to-slate-900",
    },
    {
      title: "Pending",
      value: summary.pending,
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
      title: "Rejected",
      value: summary.rejected,
      icon: AlertCircle,
      accent: "from-rose-500 to-red-600",
    },
  ]

  return (
    <div className="space-y-6 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
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
        <div className="flex justify-between">
          <p className="text-xl font-semibold">Requisition list</p>
          <div className="w-full sm:w-90">
            <RequisitionForm
              isAdmin={isAdmin}
              canCreateRequisition={canCreateRequisition}
            />
          </div>
        </div>

        {/* Table */}

        <div className="-mx-4 overflow-x-auto sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <RequisitionTable data={requisitions} isAdmin={isAdmin} />
          </div>
        </div>
      </div>
    </div>
  )
}
