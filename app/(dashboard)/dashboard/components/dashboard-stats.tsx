import { Users, UserCheck, User, Baby } from "lucide-react"
import { StatCard } from "./stat-card"

interface TrendData {
  current: number
  previous: number
  change: number
}

interface DashboardStatsProps {
  totalMembers: number
  maleCount: number
  femaleCount: number
  childrenCount: number
  isAdmin?: boolean
  trends?: {
    totalMembers: TrendData
    maleMembers: TrendData
    femaleMembers: TrendData
    children: TrendData
  }
}

export function DashboardStats({
  totalMembers,
  maleCount,
  femaleCount,
  childrenCount,
  isAdmin = true,
  trends,
}: DashboardStatsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Members"
        value={totalMembers}
        trend={
          trends?.totalMembers.change !== undefined &&
          trends.totalMembers.change !== 0
            ? `${trends.totalMembers.change > 0 ? "+" : ""}${trends.totalMembers.change}%`
            : undefined
        }
        trendUp={
          trends?.totalMembers.change !== undefined
            ? trends.totalMembers.change >= 0
            : undefined
        }
        icon={<Users className="h-5 w-5" />}
        description="All registered members"
        color="gold"
      />

      {isAdmin && (
        <>
          <StatCard
            title="Male Members"
            value={maleCount}
            trend={
              trends?.maleMembers.change !== undefined &&
              trends.maleMembers.change !== 0
                ? `${trends.maleMembers.change > 0 ? "+" : ""}${trends.maleMembers.change}%`
                : undefined
            }
            trendUp={
              trends?.maleMembers.change !== undefined
                ? trends.maleMembers.change >= 0
                : undefined
            }
            icon={<UserCheck className="h-5 w-5" />}
            description="Registered male members"
            color="blue"
          />
          <StatCard
            title="Female Members"
            value={femaleCount}
            trend={
              trends?.femaleMembers.change !== undefined &&
              trends.femaleMembers.change !== 0
                ? `${trends.femaleMembers.change > 0 ? "+" : ""}${trends.femaleMembers.change}%`
                : undefined
            }
            trendUp={
              trends?.femaleMembers.change !== undefined
                ? trends.femaleMembers.change >= 0
                : undefined
            }
            icon={<User className="h-5 w-5" />}
            description="Registered female members"
            color="rose"
          />
          <StatCard
            title="Children"
            value={childrenCount}
            trend={
              trends?.children.change !== undefined &&
              trends.children.change !== 0
                ? `${trends.children.change > 0 ? "+" : ""}${trends.children.change}%`
                : undefined
            }
            trendUp={
              trends?.children.change !== undefined
                ? trends.children.change >= 0
                : undefined
            }
            icon={<Baby className="h-5 w-5" />}
            description="Registered children"
            color="emerald"
          />
        </>
      )}
    </div>
  )
}
