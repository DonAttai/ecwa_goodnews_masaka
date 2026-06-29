import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { prisma } from "@/lib/prisma"
import { CalendarDays, Heart } from "lucide-react"
import RelativeTime from "./relative-time"

interface RecentActivityProps {
  activities: Awaited<ReturnType<typeof prisma.auditLog.findMany>>
}

export default function RecentActivity({ activities }: RecentActivityProps) {
  return (
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
          <p className="text-sm text-[#8a95a8]">Latest updates</p>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="group flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-[#f8f6f3]"
              >
                <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#c9a84c]/10 text-[#c9a84c]">
                  <Heart className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1 space-y-0.5">
                  <p className="text-sm font-medium text-[#1a2332]">
                    {activity.description}
                  </p>
                  {/* <p className="text-xs text-[#8a95a8]">{activity.action}</p> */}
                  <p className="text-xs text-[#c9a84c]/60">
                    {/* {formatRelativeTime(activity.createdAt)} */}
                    <RelativeTime date={activity.createdAt} />
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </div>
    </Card>
  )
}
