import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/app/actions/auth"
import AdminQuickActions from "./components/admin-quick-actions"
import { DashboardStats } from "./components/dashboard-stats"
import AnalyticsCard from "./components/analytics-card"
import RecentActivity from "./components/recent-activity"
import UserDashboard from "./components/user-dashboard"

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

  if (currentUser.role === "USER") {
    return <UserDashboard user={currentUser} />
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
      <div
        className={`grid gap-6 pb-12 ${
          isAdmin ? "grid-cols-1 lg:grid-cols-3" : "grid-cols-1"
        }`}
      >
        {isAdmin ? (
          <>
            <div className="lg:col-span-2">
              <AnalyticsCard />
            </div>

            <RecentActivity activities={activities} />
          </>
        ) : (
          <div className="mx-auto w-full max-w-3xl">
            <AnalyticsCard />
          </div>
        )}
      </div>

      {/* 🔥 QUICK ACTIONS */}
      {isAdmin && <AdminQuickActions />}
    </div>
  )
}
