"use client"

import Link from "next/link"
import {
  BadgeCheck,
  ListChecks,
  UserPlus,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const featureCards = [
  {
    title: "Member Directory",
    description:
      "View and manage all registered church members from one central location.",
    icon: Users,
  },
  {
    title: "Member Onboarding",
    description:
      "Register new members with their personal, family and fellowship details.",
    icon: UserPlus,
  },
  {
    title: "Records & History",
    description:
      "Review member details, membership status, and edit records as needed.",
    icon: ListChecks,
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
              Manage church members from the dedicated Members module — register
              new members, view the directory, track fellowship groups, and
              keep membership records up to date.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button asChild>
            <Link href="/dashboard/members">Go to Members</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/dashboard/members/create">Register a New Member</Link>
          </Button>
        </div>
      </section>

      {/* Capabilities */}
      <section>
        <div className="mb-6">
          <h2 className="text-xl font-semibold">What you can do</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            All membership tools are available now in the Members module.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {featureCards.map((feature) => {
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
