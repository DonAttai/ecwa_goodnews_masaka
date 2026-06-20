import DashboardHeader from "./components/dashboard-header"
import DashboardFooter from "./components/dashboard-footer"
import DashboardSidebar from "./components/dashboard-sidebar"
import MobileSidebar from "./components/mobile-sidebar"

import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"

import { SidebarProvider } from "./components/sidebar-context"
import { Toaster } from "sonner"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  if (!session) redirect("/login")

  const user = await prisma.user.findUnique({
    where: { email: session?.email },
    select: { name: true, role: true },
  })

  if (!user) redirect("/login")

  const userRole = user?.role || "WORKER"

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
          <DashboardHeader title="Dashboard" user={user} />

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
