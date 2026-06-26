"use client"

import { Construction, Users } from "lucide-react"

export default function MembershipLandingPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6">
      <div className="max-w-lg text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <Users className="h-10 w-10 text-primary" />
        </div>

        <h1 className="text-3xl font-bold tracking-tight">Membership Module</h1>

        <p className="mt-4 leading-7 text-muted-foreground">
          This section is currently being prepared. Soon you'll be able to
          manage church members, track attendance, organize groups, monitor
          membership status, and access detailed member information from one
          place.
        </p>

        <div className="mt-8 rounded-xl border bg-muted/40 p-5">
          <div className="flex items-center justify-center gap-2 text-sm font-medium">
            <Construction className="h-4 w-4" />
            Under Development
          </div>

          <p className="mt-2 text-sm text-muted-foreground">
            We're working to make this module available in a future update.
          </p>
        </div>
      </div>
    </div>
  )
}
