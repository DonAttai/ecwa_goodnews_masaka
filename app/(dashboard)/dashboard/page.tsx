import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Users,
  UserCheck,
  User,
  Baby,
  CalendarDays,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Church,
  Heart,
} from "lucide-react"
import { getCurrentUser } from "@/app/actions/auth"
import { cn } from "@/lib/utils"

export default async function Dashboard() {
  const currentUser = await getCurrentUser()

  const isAdmin = currentUser?.role === "ADMIN"

  if (!currentUser) redirect("/login")

  const [totalMembers, maleCount, femaleCount, childrenCount] =
    await Promise.all([
      prisma.member.count(),
      prisma.member.count({ where: { gender: "MALE" } }),
      prisma.member.count({ where: { gender: "FEMALE" } }),
      prisma.child.count(),
    ])

  // Calculate percentages for trends (mock data for demo)
  const trends = {
    total: "+12%",
    male: "+8%",
    female: "+15%",
    children: "+5%",
  }

  return (
    <div className="space-y-6">
      {/* 🔥 KPI GRID - WARM & ELEGANT */}
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

      {/* BOTTOM SECTION - ANALYTICS & ACTIVITY */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Analytics Card */}
        <Card className="overflow-hidden border-[#e2dcd5]/50 shadow-sm transition-all duration-300 hover:shadow-md lg:col-span-2">
          <div className="relative">
            {/* Gold top accent */}
            <div className="absolute top-0 left-0 h-1 w-20 bg-linear-to-r from-[#c9a84c] to-[#e8d5a3]" />

            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-[#1a2332]">
                  Analytics Overview
                </CardTitle>
                <button className="text-xs font-medium text-[#c9a84c] transition-colors hover:text-[#b8973e]">
                  View All →
                </button>
              </div>
              <p className="text-sm text-[#8a95a8]">
                Church growth and attendance trends
              </p>
            </CardHeader>

            <CardContent>
              <div className="flex h-50 items-center justify-center rounded-xl bg-[#f8f6f3]">
                <div className="text-center">
                  <TrendingUp className="mx-auto h-12 w-12 text-[#c9a84c]/30" />
                  <p className="mt-2 text-sm text-[#8a95a8]">
                    Chart coming soon
                  </p>
                  <p className="text-xs text-[#8a95a8]/60">
                    Monthly attendance & growth data
                  </p>
                </div>
              </div>
            </CardContent>
          </div>
        </Card>

        {/* Recent Activity Card */}
        <Card className="border-[#e2dcd5]/50 shadow-sm transition-all duration-300 hover:shadow-md">
          <div className="relative">
            {/* Gold top accent */}
            <div className="absolute top-0 left-0 h-1 w-20 bg-linear-to-r from-[#c9a84c] to-[#e8d5a3]" />

            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-[#1a2332]">
                  Recent Activity
                </CardTitle>
                <CalendarDays className="h-4 w-4 text-[#c9a84c]" />
              </div>
              <p className="text-sm text-[#8a95a8]">Latest member updates</p>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    name: "Sarah Johnson",
                    action: "joined as member",
                    time: "2 min ago",
                  },
                  {
                    name: "Pastor Michael",
                    action: "updated profile",
                    time: "1 hour ago",
                  },
                  {
                    name: "Grace Family",
                    action: "added 2 children",
                    time: "3 hours ago",
                  },
                ].map((activity, i) => (
                  <div
                    key={i}
                    className="group flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-[#f8f6f3]"
                  >
                    <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#c9a84c]/10 text-[#c9a84c]">
                      <Heart className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex-1 space-y-0.5">
                      <p className="text-sm font-medium text-[#1a2332]">
                        {activity.name}
                      </p>
                      <p className="text-xs text-[#8a95a8]">
                        {activity.action}
                      </p>
                      <p className="text-xs text-[#c9a84c]/60">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </div>
        </Card>
      </div>

      {/* 🔥 QUICK ACTIONS */}
      {isAdmin && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Add New Member", icon: Users, color: "gold" },
            { label: "View Reports", icon: TrendingUp, color: "blue" },
            { label: "Schedule Event", icon: CalendarDays, color: "emerald" },
            { label: "Send Message", icon: Heart, color: "rose" },
          ].map((action, i) => (
            <button
              key={i}
              className="group flex items-center justify-center gap-2 rounded-xl border border-[#e2dcd5]/50 bg-white px-4 py-3 text-sm font-medium text-[#1a2332] transition-all duration-300 hover:border-[#c9a84c]/30 hover:bg-[#f8f6f3] hover:shadow-md hover:shadow-[#c9a84c]/5"
            >
              <action.icon
                className={cn(
                  "h-4 w-4 transition-colors",
                  action.color === "gold" && "text-[#c9a84c]",
                  action.color === "blue" && "text-blue-500",
                  action.color === "emerald" && "text-emerald-500",
                  action.color === "rose" && "text-rose-500"
                )}
              />
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// 🔥 UPDATED STAT CARD WITH TRENDS
function StatCard({
  title,
  value,
  trend,
  trendUp,
  icon,
  description,
  color = "gold",
}: {
  title: string
  value: string | number
  trend?: string
  trendUp?: boolean
  icon: React.ReactNode
  description?: string
  color?: "gold" | "blue" | "rose" | "emerald"
}) {
  const colorClasses = {
    gold: {
      bg: "bg-[#c9a84c]/10",
      text: "text-[#c9a84c]",
      border: "border-[#c9a84c]/20",
      hover: "hover:shadow-[#c9a84c]/10",
    },
    blue: {
      bg: "bg-blue-500/10",
      text: "text-blue-500",
      border: "border-blue-500/20",
      hover: "hover:shadow-blue-500/10",
    },
    rose: {
      bg: "bg-rose-500/10",
      text: "text-rose-500",
      border: "border-rose-500/20",
      hover: "hover:shadow-rose-500/10",
    },
    emerald: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-500",
      border: "border-emerald-500/20",
      hover: "hover:shadow-emerald-500/10",
    },
  }

  const colors = colorClasses[color]

  return (
    <Card
      className={cn(
        "group relative overflow-hidden border-[#e2dcd5]/50 bg-white shadow-sm transition-all duration-300",
        "hover:-translate-y-0.5 hover:shadow-lg",
        colors.hover
      )}
    >
      {/* Decorative top bar with color */}
      <div
        className={cn(
          "absolute top-0 left-0 h-1 w-12 transition-all duration-300 group-hover:w-16",
          color === "gold" && "bg-linear-to-r from-[#c9a84c] to-[#e8d5a3]",
          color === "blue" && "bg-linear-to-r from-blue-500 to-blue-400",
          color === "rose" && "bg-linear-to-r from-rose-500 to-rose-400",
          color === "emerald" &&
            "bg-linear-to-r from-emerald-500 to-emerald-400"
        )}
      />

      <CardHeader className="flex flex-row items-center justify-between space-y-0 pt-4 pb-2">
        <CardTitle className="text-sm font-medium text-[#8a95a8]">
          {title}
        </CardTitle>

        <div
          className={cn(
            "rounded-xl p-2.5 transition-all duration-300",
            colors.bg,
            colors.text,
            "group-hover:scale-110 group-hover:rotate-3"
          )}
        >
          {icon}
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex items-end justify-between">
          <div>
            <div className="text-2xl font-bold tracking-tight text-[#1a2332]">
              {value}
            </div>
            {description && (
              <p className="mt-0.5 text-xs text-[#8a95a8]">{description}</p>
            )}
          </div>

          {trend && (
            <div
              className={cn(
                "flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium",
                trendUp
                  ? "bg-emerald-500/10 text-emerald-600"
                  : "bg-rose-500/10 text-rose-600"
              )}
            >
              {trendUp ? (
                <ArrowUpRight className="h-3 w-3" />
              ) : (
                <ArrowDownRight className="h-3 w-3" />
              )}
              {trend}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
