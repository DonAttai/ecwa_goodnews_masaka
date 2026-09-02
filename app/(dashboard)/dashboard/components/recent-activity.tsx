import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { prisma } from "@/lib/prisma"
import { Activity, UserPlus, UserCog, LogIn } from "lucide-react"
import { cn } from "@/lib/utils"
import RelativeTime from "./relative-time"

type ActivityItem = Awaited<ReturnType<typeof prisma.auditLog.findMany>>[number]

interface RecentActivityProps {
  activities: ActivityItem[]
}

const ACTION_ICONS: Record<string, { icon: React.ReactNode; accent: string }> =
  {
    CREATE_MEMBER: {
      icon: <UserPlus className="h-3.5 w-3.5" />,
      accent: "bg-primary/10 text-primary",
    },
    UPDATE_MEMBER: {
      icon: <UserCog className="h-3.5 w-3.5" />,
      accent: "bg-blue-500/10 text-blue-500",
    },
    LOGIN: {
      icon: <LogIn className="h-3.5 w-3.5" />,
      accent: "bg-emerald-500/10 text-emerald-600",
    },
  }

export default function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <Card className="border-border bg-card shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="relative">
        {/* Gold top accent */}
        <div className="absolute top-0 left-0 h-1 w-20 bg-linear-to-r from-primary to-[#e8d5a3]" />

        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-foreground">
              Recent Activity
            </CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">Latest updates</p>
        </CardHeader>

        <CardContent>
          {activities.length === 0 ? (
            <p className="text-sm text-muted-foreground">No activity yet.</p>
          ) : (
            <div className="space-y-4">
              {activities.map((activity) => {
                const meta = ACTION_ICONS[activity.action] ?? {
                  icon: <Activity className="h-3.5 w-3.5" />,
                  accent: "bg-muted text-muted-foreground",
                }
                return (
                  <div
                    key={activity.id}
                    className="group flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-muted/50"
                  >
                    <div
                      className={cn(
                        "mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                        meta.accent
                      )}
                    >
                      {meta.icon}
                    </div>
                    <div className="flex-1 space-y-0.5">
                      <p className="text-sm font-medium text-foreground">
                        {activity.description}
                      </p>
                      <p className="text-xs text-primary/60">
                        <RelativeTime date={activity.createdAt} />
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </div>
    </Card>
  )
}
