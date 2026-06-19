import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserCheck, CalendarDays, Activity } from "lucide-react"
import { getCurrentUser } from "@/app/actions/auth"

export default async function Dashboard() {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect("/login")
  }

  const totalMembers = await prisma.member.count()

  const maleCount = await prisma.member.count({
    where: { gender: "MALE" },
  })
  const femaleCount = await prisma.member.count({
    where: { gender: "FEMALE" },
  })

  const children = await prisma.child.count()

  return (
    <div className="space-y-4 p-3 sm:space-y-6 sm:p-4 md:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Dashboard
        </h1>
        <div className="text-xs text-muted-foreground sm:text-sm">
          Welcome back, {currentUser?.name}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        <StatCard
          title="Total Members"
          value={totalMembers}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="Men"
          value={maleCount}
          icon={<UserCheck className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="Women"
          value={femaleCount}
          icon={<CalendarDays className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="Children"
          value={children}
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
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-xl font-bold sm:text-2xl">{value}</div>
      </CardContent>
    </Card>
  )
}
