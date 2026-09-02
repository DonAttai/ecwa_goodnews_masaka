import Link from "next/link"
import {
  ClipboardList,
  CheckCircle2,
  CircleDollarSign,
  Flag,
  Wallet,
  TrendingUp,
  ListFilter,
  AlertTriangle,
  ArrowRight,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { StatCard } from "./stat-card"
import RelativeTime from "./relative-time"
import {
  STATUS_CLASSES,
  PRIORITY_CLASSES,
  DEFAULT_BADGE_CLASS,
} from "../requisitions/constants/badge-classes"
import type { FinanceDashboardData } from "../lib/dashboard-data"

interface StaffFinanceDashboardProps {
  data: FinanceDashboardData
}

export default function StaffFinanceDashboard({
  data,
}: StaffFinanceDashboardProps) {
  const { requisitionCounts, needsAttention, urgentItems, spendByDepartment } =
    data

  return (
    <div className="space-y-6">
      {/* Financial Snapshot */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Pending Value"
          value={formatMoney(data.pendingValue, "NGN")}
          icon={<Wallet className="h-5 w-5" />}
          description="Awaiting action (submitted + approved)"
          color="gold"
        />
        <StatCard
          title="Paid This Month"
          value={formatMoney(data.paidThisMonth, "NGN")}
          icon={<TrendingUp className="h-5 w-5" />}
          description="Money paid out this month"
          color="emerald"
        />
        <StatCard
          title="Total Requisitions"
          value={data.totalRequisitions}
          icon={<ListFilter className="h-5 w-5" />}
          description="All-time requisitions"
          color="blue"
        />
        <StatCard
          title="Pending Approvals"
          value={data.pendingApprovals}
          icon={<AlertTriangle className="h-5 w-5" />}
          description="Submitted awaiting review"
          color="rose"
        />
      </div>

      {/* Requisition flow counts */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Submitted"
          value={requisitionCounts.SUBMITTED}
          icon={<ClipboardList className="h-5 w-5" />}
          description="Awaiting review"
          color="gold"
        />
        <StatCard
          title="Approved"
          value={requisitionCounts.APPROVED}
          icon={<CheckCircle2 className="h-5 w-5" />}
          description="Awaiting payment"
          color="blue"
        />
        <StatCard
          title="Paid"
          value={requisitionCounts.PAID}
          icon={<CircleDollarSign className="h-5 w-5" />}
          description="Paid out"
          color="emerald"
        />
        <StatCard
          title="Completed"
          value={requisitionCounts.COMPLETED}
          icon={<Flag className="h-5 w-5" />}
          description="Fully resolved"
          color="rose"
        />
      </div>

      {/* High priority alerts */}
      {urgentItems.length > 0 && (
        <Card className="border-rose-200/70 bg-rose-50/50">
          <CardContent className="pt-6">
            <div className="mb-3 flex items-center gap-2">
              <AlertTriangle
                className="h-4 w-4 text-rose-600"
                aria-hidden="true"
              />
              <h3 className="text-sm font-semibold text-rose-700">
                High Priority Requisitions
              </h3>
            </div>
            <div className="space-y-2">
              {urgentItems.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-white/70 p-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {item.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.requestedBy.name}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {item.amount !== null && (
                      <span className="text-sm font-semibold text-foreground">
                        {formatMoney(item.amount, item.currency)}
                      </span>
                    )}
                    <Badge
                      variant="outline"
                      className={cn(
                        PRIORITY_CLASSES[item.priority] ?? DEFAULT_BADGE_CLASS
                      )}
                    >
                      {item.priority}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={cn(
                        STATUS_CLASSES[item.status] ?? DEFAULT_BADGE_CLASS
                      )}
                    >
                      {item.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 pb-12 lg:grid-cols-3">
        {/* Needs attention */}
        <Card className="border-border bg-card shadow-sm lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-foreground">
              Needs Your Attention
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Active requisitions in the workflow
            </p>
          </CardHeader>
          <CardContent>
            {needsAttention.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nothing awaiting action. Great job!
              </p>
            ) : (
              <div className="space-y-3">
                {needsAttention.map((req) => (
                  <div
                    key={req.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border p-3 transition-colors hover:bg-muted/50 sm:flex-nowrap"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {req.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {req.requestedBy.name} ·{" "}
                        <RelativeTime date={req.createdAt} />
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      {req.amount !== null && (
                        <span className="text-sm font-semibold text-foreground">
                          {formatMoney(req.amount, req.currency)}
                        </span>
                      )}
                      <Badge
                        variant="outline"
                        className={cn(
                          STATUS_CLASSES[req.status] ?? DEFAULT_BADGE_CLASS
                        )}
                      >
                        {req.status}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={cn(
                          PRIORITY_CLASSES[req.priority] ?? DEFAULT_BADGE_CLASS
                        )}
                      >
                        {req.priority}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right column */}
        <div className="space-y-6">
          {/* Spend by department */}
          <Card className="border-border bg-card shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-foreground">
                Spend by Department
              </CardTitle>
            </CardHeader>
            <CardContent>
              {spendByDepartment.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No requisition data yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {spendByDepartment.map((dept) => (
                    <div key={dept.name}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="font-medium text-foreground">
                          {dept.name}
                        </span>
                        <span className="text-muted-foreground">
                          {formatMoney(dept.total, dept.currency)} ·{" "}
                          {dept.count} req
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{
                            width: `${barWidth(dept.total, spendByDepartment)}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Button asChild variant="outline" className="w-full">
            <Link href="/dashboard/requisitions">
              Manage requisitions <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

function formatMoney(amount: number, currency: string): string {
  return `${currency} ${Math.round(amount).toLocaleString()}`
}

function barWidth(value: number, list: { total: number }[]): number {
  const max = Math.max(...list.map((d) => d.total), 1)
  return Math.max((value / max) * 100, 4)
}
