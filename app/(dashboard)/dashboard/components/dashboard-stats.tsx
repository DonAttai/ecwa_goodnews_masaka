import { Users, UserCheck, User, Baby } from "lucide-react"
import { StatCard } from "./stat-card"

interface DashboardStatsProps {
  totalMembers: number
  maleCount: number
  femaleCount: number
  childrenCount: number
  trends?: {
    total: string
    male: string
    female: string
    children: string
  }
}

export function DashboardStats({
  totalMembers,
  maleCount,
  femaleCount,
  childrenCount,
  trends = {
    total: "+12%",
    male: "+8%",
    female: "+15%",
    children: "+5%",
  },
}: DashboardStatsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Members"
        value={totalMembers}
        trend={trends.total}
        trendUp={true}
        icon={<Users className="h-5 w-5" />}
        description="All registered members"
        color="gold"
      />
      <StatCard
        title="Male Members"
        value={maleCount}
        trend={trends.male}
        trendUp={true}
        icon={<UserCheck className="h-5 w-5" />}
        description="Active male members"
        color="blue"
      />
      <StatCard
        title="Female Members"
        value={femaleCount}
        trend={trends.female}
        trendUp={true}
        icon={<User className="h-5 w-5" />}
        description="Active female members"
        color="rose"
      />
      <StatCard
        title="Children"
        value={childrenCount}
        trend={trends.children}
        trendUp={true}
        icon={<Baby className="h-5 w-5" />}
        description="Registered children"
        color="emerald"
      />
    </div>
  )
}
