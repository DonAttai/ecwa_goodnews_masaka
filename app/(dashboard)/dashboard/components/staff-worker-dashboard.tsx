import Link from "next/link"
import {
  Users,
  UserPlus,
  UserCheck,
  User,
  Network,
  MapPin,
  ClipboardList,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatCard } from "./stat-card"
import type { WorkerDashboardData } from "../lib/dashboard-data"

interface StaffWorkerDashboardProps {
  data: WorkerDashboardData
  userName?: string
  departmentName?: string | null
}

export default function StaffWorkerDashboard({
  data,
  userName,
  departmentName,
}: StaffWorkerDashboardProps) {
  const greeting = (() => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 17) return "Good afternoon"
    return "Good evening"
  })()

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="overflow-hidden rounded-3xl border border-border bg-linear-to-br from-[#1a2332] via-[#22304a] to-[#2f4362] p-6 text-white shadow-sm sm:p-8">
        <p className="text-sm font-medium tracking-[0.25em] text-[#e8d5a3] uppercase">
          Worker dashboard
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          {greeting}
          {userName ? `, ${userName}` : ""}
        </h1>
        <p className="mt-2 max-w-xl text-sm text-slate-200">
          {departmentName
            ? `Frontline operations · ${departmentName}`
            : "Frontline operations overview"}
        </p>
      </div>

      {/* Operational KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Members"
          value={data.totalMembers}
          icon={<Users className="h-5 w-5" />}
          description="All registered members"
          color="gold"
        />
        <StatCard
          title="New This Month"
          value={data.newMembersThisMonth}
          icon={<UserPlus className="h-5 w-5" />}
          description="Registered this month"
          color="emerald"
        />
        <StatCard
          title="Male"
          value={data.maleCount}
          icon={<UserCheck className="h-5 w-5" />}
          description="Male members"
          color="blue"
        />
        <StatCard
          title="Female"
          value={data.femaleCount}
          icon={<User className="h-5 w-5" />}
          description="Female members"
          color="rose"
        />
      </div>

      <div className="grid gap-6 pb-12 lg:grid-cols-3">
        {/* Fellowship groups */}
        <Card className="border-border bg-card shadow-sm lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <Network className="h-4 w-4 text-primary" />
              Fellowship Groups
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Groups and active member counts
            </p>
          </CardHeader>
          <CardContent>
            {data.fellowships.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No fellowship groups yet.
              </p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {data.fellowships.map((group) => (
                  <div
                    key={group.id}
                    className="flex items-center justify-between rounded-xl border border-border p-3 transition-colors hover:bg-muted/50"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {group.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Fellowship
                      </p>
                    </div>
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {group.memberCount}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right column: zones + quick actions */}
        <div className="space-y-6">
          <Card className="border-border bg-card shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                Zones
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.zones.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No zone information yet.
                </p>
              ) : (
                <div className="space-y-2.5">
                  {data.zones.map((zone) => (
                    <div key={zone.name}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="font-medium text-foreground">
                          {zone.name}
                        </span>
                        <span className="text-muted-foreground">
                          {zone.count}
                        </span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{
                            width: `${zoneBar(zone.count, data.zones)}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border bg-card shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-foreground">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                asChild
                variant="outline"
                className="w-full justify-start"
              >
                <Link href="/dashboard/requisitions">
                  <ClipboardList className="mr-2 h-4 w-4 text-primary" />
                  Submit requisition
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full justify-start"
              >
                <Link href="/dashboard/members">
                  <Users className="mr-2 h-4 w-4 text-primary" />
                  View members
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function zoneBar(value: number, list: { count: number }[]): number {
  const max = Math.max(...list.map((z) => z.count), 1)
  return Math.max((value / max) * 100, 8)
}
