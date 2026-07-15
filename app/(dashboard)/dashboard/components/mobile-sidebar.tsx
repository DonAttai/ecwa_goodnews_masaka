"use client"
import { useEffect } from "react"
import { usePathname } from "next/navigation"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet"
import DashboardSidebar from "./dashboard-sidebar"
import { useSidebar } from "./sidebar-context"

export default function MobileSidebar({
  userRole,
}: {
  userRole: "ADMIN" | "WORKER" | "USER"
}) {
  const { open, setOpen } = useSidebar()
  const pathname = usePathname()

  useEffect(() => {
    if (open) {
      setOpen(false)
    }
  }, [pathname, setOpen])

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        side="left"
        className="w-72 border-r border-[#2a3444] bg-[#1a2332] p-0 [data-radix-collection-item]:hidden [&>button]:hidden" // ← Stronger hiding
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Navigation Menu</SheetTitle>
        </SheetHeader>

        <DashboardSidebar userRole={userRole} isMobile={true} />
      </SheetContent>
    </Sheet>
  )
}
