"use client"

import {
  BadgeCheck,
  CalendarDays,
  Construction,
  UserPlus,
  Users,
} from "lucide-react"

const upcomingFeatures = [
  {
    title: "Member Directory",
    description:
      "View and manage all registered church members from one central location.",
    icon: Users,
  },
  {
    title: "Visitor & New Member Tracking",
    description:
      "Record first-time visitors and follow up with prospective members.",
    icon: UserPlus,
  },
  {
    title: "Attendance Records",
    description:
      "Track attendance for services, fellowships, and special events.",
    icon: CalendarDays,
  },
  {
    title: "Membership Status",
    description: "Monitor active members, transfers, and membership history.",
    icon: BadgeCheck,
  },
]

export default function MembershipLandingPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8 p-4 sm:p-6 lg:p-8">
      {/* Hero Card */}
      <section className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
        <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:items-center sm:text-left">
          <div className="rounded-2xl bg-primary/10 p-4">
            <Users className="h-10 w-10 text-primary" />
          </div>

          <div className="flex-1">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Membership
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              Welcome to the Membership module. This section is currently under
              development and will soon provide everything you need to manage
              church members, attendance, visitor follow-up, and membership
              records.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center gap-3 rounded-xl border bg-muted/40 p-4 text-center sm:flex-row sm:text-left">
          <Construction className="h-5 w-5 shrink-0 text-primary" />

          <div>
            <p className="font-medium">Module Under Development</p>

            <p className="text-sm text-muted-foreground">
              New features will be added in an upcoming release.
            </p>
          </div>
        </div>
      </section>

      {/* Upcoming Features */}
      <section>
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Planned Features</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Here's a preview of what you'll soon be able to do.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {upcomingFeatures.map((feature) => {
            const Icon = feature.icon

            return (
              <div
                key={feature.title}
                className="group rounded-xl border bg-card p-6 transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
              >
                <div className="mb-5 inline-flex rounded-lg bg-primary/10 p-3 transition-colors group-hover:bg-primary/15">
                  <Icon className="h-6 w-6 text-primary" />
                </div>

                <h3 className="text-lg font-semibold">{feature.title}</h3>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
