import DashboardHeader from "./components/dashboard-header"
import DashboardFooter from "./components/dashboard-footer"
import DashboardSidebar from "./components/dashboard-sidebar"

import { redirect } from "next/navigation"
import { getCurrentUser } from "@/app/actions/auth"
import { prisma } from "@/lib/prisma"
import { LayoutUser } from "./types"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const currentUser = await getCurrentUser()
  if (!currentUser) redirect("/login")

  const layoutUser = currentUser as LayoutUser

  let pendingCount = 0
  try {
    if (currentUser.role !== "EDITOR") {
      pendingCount = await prisma.requisition.count({ where: { status: "SUBMITTED" } })
    }
  } catch {
    pendingCount = 0
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      {/* DESKTOP SIDEBAR - Sticky */}
      <div className="hidden md:sticky md:top-0 md:z-10 md:flex md:h-screen">
        <DashboardSidebar user={layoutUser} pendingCount={pendingCount} />
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
        <DashboardHeader title="Dashboard" user={currentUser} />

        {/* Only the main content scrolls, header and footer are fixed */}
        <main id="main-content" className="flex-1 overflow-y-auto bg-background">
          <div className="mx-auto h-full w-full max-w-[1400px] p-4 sm:p-6 lg:p-8">{children}</div>
        </main>

        <DashboardFooter user={layoutUser} />
      </div>
    </div>
  )
}
