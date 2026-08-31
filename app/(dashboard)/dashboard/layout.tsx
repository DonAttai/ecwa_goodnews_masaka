import DashboardHeader from "./components/dashboard-header"
import DashboardFooter from "./components/dashboard-footer"
import DashboardSidebar from "./components/dashboard-sidebar"

import { redirect } from "next/navigation"
import { getCurrentUser } from "@/app/actions/auth"
import { LayoutUser } from "./types"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const currentUser = await getCurrentUser()
  if (!currentUser) redirect("/login")

  const layoutUser = currentUser as LayoutUser
  return (
    <div className="flex h-screen overflow-hidden bg-[#f8f6f3] text-[#1a2332]">
      {/* DESKTOP SIDEBAR - Sticky */}
      <div className="hidden md:sticky md:top-0 md:z-10 md:flex md:h-screen">
        <DashboardSidebar user={layoutUser} />
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
        <DashboardHeader title="Dashboard" user={currentUser} />

        {/* Only the main content scrolls, header and footer are fixed */}
        <main className="flex-1 overflow-y-auto bg-[#f8f6f3]">
          <div className="h-full w-full p-4 sm:p-6">{children}</div>
        </main>

        <DashboardFooter user={layoutUser} />
      </div>
    </div>
  )
}
