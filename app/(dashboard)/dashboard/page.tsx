import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/app/actions/auth"
import AdminQuickActions from "./components/admin-quick-actions"
import { DashboardStats } from "./components/dashboard-stats"
import AnalyticsCard from "./components/analytics-card"
import RecentActivity from "./components/recent-activity"

export default async function Dashboard() {
  const currentUser = await getCurrentUser()

  const isAdmin = currentUser?.role === "ADMIN"

  if (!currentUser) redirect("/login")

  const [totalMembers, maleCount, femaleCount, childrenCount, activities] =
    await Promise.all([
      prisma.member.count(),
      prisma.member.count({ where: { gender: "MALE" } }),
      prisma.member.count({ where: { gender: "FEMALE" } }),
      prisma.child.count(),
      prisma.auditLog.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { user: true },
      }),
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
      <DashboardStats
        totalMembers={totalMembers}
        femaleCount={femaleCount}
        maleCount={maleCount}
        childrenCount={childrenCount}
      />

      {/* BOTTOM SECTION - ANALYTICS & ACTIVITY */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Analytics Card */}
        <AnalyticsCard />
        {/* Recent Activity Card */}
        <RecentActivity activities={activities} />
      </div>

      {/* 🔥 QUICK ACTIONS */}
      {isAdmin && <AdminQuickActions />}
    </div>
  )
}
