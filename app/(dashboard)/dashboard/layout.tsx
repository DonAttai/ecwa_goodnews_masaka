import DashboardHeader from "./components/dashboard-header"
import DashboardFooter from "./components/dashboard-footer"
import DashboardSidebar from "./components/dashboard-sidebar"
import MobileSidebar from "./components/mobile-sidebar"

import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"

import { SidebarProvider } from "./components/sidebar-context"
import { getCurrentUser } from "@/app/actions/auth"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const curretntUser = await getCurrentUser()
  if (!curretntUser) redirect("/login")

  const userRole = curretntUser?.role || "WORKER"

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden bg-[#f8f6f3] text-[#1a2332]">
        {/* DESKTOP SIDEBAR - Sticky */}
        <div className="hidden md:sticky md:top-0 md:flex md:h-screen">
          <DashboardSidebar userRole={userRole} />
        </div>

        {/* MOBILE SIDEBAR */}
        <MobileSidebar userRole={userRole} />

        {/* MAIN CONTENT AREA */}
        <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
          <DashboardHeader title="Dashboard" user={curretntUser} />

          {/* Only the main content scrolls, header and footer are fixed */}
          <main className="flex-1 overflow-y-auto bg-[#f8f6f3]">
            <div className="h-full w-full p-4 sm:p-6">{children}</div>
          </main>

          <DashboardFooter />
        </div>
      </div>
    </SidebarProvider>
  )
}
