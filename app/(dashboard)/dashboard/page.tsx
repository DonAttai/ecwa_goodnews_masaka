import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserCheck, CalendarDays, Activity } from "lucide-react"
export default async function Dashboard() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  const currentUser = await prisma.user.findUnique({
    where: { email: session?.email! },
    select: { role: true, isActive: true, name: true },
  })

  // Fetch real stats (example for admin)
  const totalMembers = await prisma.member.count()

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="text-sm text-muted-foreground">
          Welcome back, {currentUser?.name}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Members"
          value={totalMembers}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="Men"
          value="5"
          icon={<UserCheck className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="Women"
          value="12"
          icon={<CalendarDays className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="Children"
          value="10"
          icon={<Activity className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      {/* Role-specific content */}
      {/* {currentUser?.role === "ADMIN" ? <AdminPanel /> : <MemberOverview />} */}
    </div>
  )
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string
  value: string | number
  icon: React.ReactNode
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  )
}
