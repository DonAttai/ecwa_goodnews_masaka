import { redirect } from "next/navigation"
import { UserPlus, ClipboardList, Clock, Building2 } from "lucide-react"
import { prisma, Role } from "@/lib/prisma"
import { getCurrentUser } from "@/app/actions/auth"
import { DashboardStats } from "./components/dashboard-stats"
import AnalyticsCard from "./components/analytics-card"
import RecentActivity from "./components/recent-activity"
import UserDashboard from "./components/user-dashboard"
import StaffDashboard from "./components/staff-dashboard"
import { StatCard } from "./components/stat-card"
import { getDashboardAnalytics } from "./lib/dashboard-data"

export default async function Dashboard() {
  const currentUser = await getCurrentUser()

  if (!currentUser) redirect("/login")

  // USER - personal dashboard
  if (currentUser.role === Role.USER) {
    const recentRequisitions = await prisma.requisition.findMany({
      where: { requestedById: currentUser.id },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        title: true,
        status: true,
        createdAt: true,
      },
    })

    return (
      <UserDashboard
        user={currentUser}
        recentRequisitions={recentRequisitions}
      />
    )
  }

  // FINANCE / WORKER - role-specific staff dashboards
  if (currentUser.role !== Role.ADMIN) {
    return (
      <StaffDashboard
        role={currentUser.role}
        name={currentUser.name}
        departmentName={currentUser.department?.name}
      />
    )
  }

  // ADMIN - full analytics dashboard matching the loading skeleton
  const analytics = await getDashboardAnalytics(currentUser.role)
  const activities = await prisma.auditLog.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { user: true },
  })

  const greeting = (() => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 17) return "Good afternoon"
    return "Good evening"
  })()

  const secondaryStats = [
    {
      title: "New Members This Month",
      value: analytics.newMembersThisMonth,
      icon: <UserPlus className="h-5 w-5" />,
      description: "Registered this month",
      color: "gold" as const,
    },
    {
      title: "Active Requisitions",
      value: analytics.activeRequisitions,
      icon: <ClipboardList className="h-5 w-5" />,
      description: "Submitted or approved",
      color: "blue" as const,
    },
    {
      title: "Pending Approvals",
      value: analytics.pendingRequisitions,
      icon: <Clock className="h-5 w-5" />,
      description: "Awaiting review",
      color: "gold" as const,
    },
    {
      title: "Departments",
      value: analytics.departments,
      icon: <Building2 className="h-5 w-5" />,
      description: "Active departments",
      color: "emerald" as const,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Greeting hero */}
      <div className="overflow-hidden rounded-3xl border border-border bg-linear-to-br from-[#1a2332] via-[#22304a] to-[#2f4362] p-6 text-white shadow-sm sm:p-8">
        <p className="text-sm font-medium tracking-[0.25em] text-[#e8d5a3] uppercase">
          Admin dashboard
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          {greeting}
          {currentUser.name ? `, ${currentUser.name}` : ""}
        </h1>
        <p className="mt-2 max-w-xl text-sm text-slate-200">
          Church growth, activity, and membership overview
        </p>
      </div>

      {/* Primary stats */}
      <DashboardStats
        totalMembers={analytics.trends.totalMembers.current}
        maleCount={analytics.trends.maleMembers.current}
        femaleCount={analytics.trends.femaleMembers.current}
        childrenCount={analytics.trends.children.current}
        trends={analytics.trends}
        isAdmin={true}
      />

      {/* Secondary stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {secondaryStats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            description={stat.description}
            color={stat.color}
          />
        ))}
      </div>

      {/* Analytics & activity */}
      <div className="grid gap-6 pb-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AnalyticsCard
            newMembersThisMonth={analytics.newMembersThisMonth}
            activeRequisitions={analytics.activeRequisitions}
            pendingRequisitions={analytics.pendingRequisitions}
            departments={analytics.departments}
            membershipChart={analytics.membershipChart}
            genderDistribution={analytics.genderDistribution}
          />
        </div>

        <RecentActivity activities={activities} />
      </div>
    </div>
  )
}
