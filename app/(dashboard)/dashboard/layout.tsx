import DashboardHeader from "./components/dashboard-header"
import DashboardFooter from "./components/dashboard-footer"
import DashboardSidebar from "./components/dashboard-sidebar"
import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
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
    <div className="flex h-screen overflow-hidden bg-slate-950 text-white">
      {" "}
      {/* Changed here */}
      {/* SIDEBAR - Sticky / Fixed */}
      <DashboardSidebar userRole={userRole} />
      {/* MAIN CONTENT AREA */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader title="Dashboard" user={user} />

        {/* Scrollable Content */}
        <main className="flex-1 overflow-auto bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
          {children}
        </main>

        <DashboardFooter />
      </div>
    </div>
  )
}
