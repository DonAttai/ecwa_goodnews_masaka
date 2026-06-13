"use client"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import DashboardSidebar from "./dashboard-sidebar"
import { useSidebar } from "./sidebar-context"

export default function MobileSidebar({
  userRole,
}: {
  userRole: "ADMIN" | "WORKER"
}) {
  const { open, setOpen } = useSidebar()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        side="left"
        className="w-72 border-slate-800 bg-slate-950 p-0"
      >
        {/* 🔥 REQUIRED FOR ACCESSIBILITY */}
        <SheetHeader className="sr-only">
          <SheetTitle>Navigation Menu</SheetTitle>
        </SheetHeader>

        <DashboardSidebar
          userRole={userRole}
          onNavigate={() => setOpen(false)}
        />
      </SheetContent>
    </Sheet>
  )
}
