import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UserPlus, ClipboardList, Clock, Building2 } from "lucide-react"
import { MembershipChart } from "./membership-chart"

interface AnalyticsCardProps {
  newMembersThisMonth?: number
  activeRequisitions?: number
  pendingRequisitions?: number
  departments?: number
  membershipChart?: { month: string; members: number }[]
  genderDistribution?: { label: string; value: number; color: string }[]
}

interface StatItem {
  label: string
  value: number
  icon: React.ReactNode
  accent: string
}

export default function AnalyticsCard({
  newMembersThisMonth = 0,
  activeRequisitions = 0,
  pendingRequisitions = 0,
  departments = 0,
  membershipChart = [],
  genderDistribution = [],
}: AnalyticsCardProps) {
  const stats: StatItem[] = [
    {
      label: "New members this month",
      value: newMembersThisMonth,
      icon: <UserPlus className="h-4 w-4" />,
      accent: "bg-primary/10 text-primary",
    },
    {
      label: "Active requisitions",
      value: activeRequisitions,
      icon: <ClipboardList className="h-4 w-4" />,
      accent: "bg-blue-500/10 text-blue-600",
    },
    {
      label: "Pending approvals",
      value: pendingRequisitions,
      icon: <Clock className="h-4 w-4" />,
      accent: "bg-amber-500/10 text-amber-600",
    },
    {
      label: "Departments",
      value: departments,
      icon: <Building2 className="h-4 w-4" />,
      accent: "bg-emerald-500/10 text-emerald-600",
    },
  ]

  return (
    <Card className="overflow-hidden border-border bg-card shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="relative">
        <div className="absolute top-0 left-0 h-1 w-20 bg-linear-to-r from-primary to-[#e8d5a3]" />

        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-foreground">
            Analytics Overview
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Church growth and activity snapshot
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-4 rounded-xl border border-border bg-card p-4"
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${stat.accent}`}
                >
                  {stat.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-2xl font-bold tracking-tight text-foreground">
                    {stat.value.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {(membershipChart.length > 0 || genderDistribution.length > 0) && (
            <MembershipChart
              data={membershipChart}
              genderData={genderDistribution}
            />
          )}
        </CardContent>
      </div>
    </Card>
  )
}
