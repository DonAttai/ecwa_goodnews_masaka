"use client"

import {
  Users,
  UserPlus,
  CalendarDays,
  BadgeCheck,
  Construction,
} from "lucide-react"

const upcomingFeatures = [
  {
    title: "Member Directory",
    icon: Users,
  },
  {
    title: "Visitor & New Member Tracking",
    icon: UserPlus,
  },
  {
    title: "Attendance Records",
    icon: CalendarDays,
  },
  {
    title: "Membership Status",
    icon: BadgeCheck,
  },
]

export default function MembershipLandingPage() {
  return (
    <div className="space-y-8 p-8">
      <div className="rounded-2xl border bg-card p-8">
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-primary/10 p-3">
            <Users className="h-8 w-8 text-primary" />
          </div>

          <div>
            <h1 className="text-3xl font-bold">Membership</h1>
            <p className="text-muted-foreground">
              This module is currently under development.
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-2 rounded-lg border bg-muted/40 p-4 text-sm">
          <Construction className="h-5 w-5 text-primary" />
          New membership management features will be available soon.
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold">Planned Features</h2>

        <div className="grid gap-4 md:grid-cols-2">
          {upcomingFeatures.map((feature) => {
            const Icon = feature.icon

            return (
              <div
                key={feature.title}
                className="rounded-xl border p-5 transition hover:bg-muted/40"
              >
                <Icon className="mb-3 h-7 w-7 text-primary" />

                <h3 className="font-medium">{feature.title}</h3>

                <p className="mt-2 text-sm text-muted-foreground">
                  Coming in a future update.
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
