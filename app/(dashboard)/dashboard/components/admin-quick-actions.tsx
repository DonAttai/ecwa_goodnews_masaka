"use client"

import {
  Users,
  TrendingUp,
  CalendarDays,
  Heart,
  ClipboardList,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

export default function AdminQuickActions() {
  const actions = [
    {
      label: "Add New Member",
      icon: Users,
      color: "gold",
      href: "/dashboard/members/create",
    },
    {
      label: "View Requisitions",
      icon: ClipboardList,
      color: "blue",
      href: "/dashboard/requisitions",
    },
    {
      label: "Schedule Event",
      icon: CalendarDays,
      color: "emerald",
      href: "/dashboard",
    },
    {
      label: "Send Message",
      icon: Heart,
      color: "rose",
      href: "/dashboard",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {actions.map((action) => (
        <Link
          key={action.label}
          href={action.href}
          className="group flex items-center justify-center gap-2 rounded-xl border border-[#e2dcd5]/50 bg-white px-4 py-3 text-sm font-medium text-[#1a2332] transition-all duration-300 hover:border-[#c9a84c]/30 hover:bg-[#f8f6f3] hover:shadow-md hover:shadow-[#c9a84c]/5"
        >
          <action.icon
            className={cn(
              "h-4 w-4 transition-colors",
              action.color === "gold" && "text-[#c9a84c]",
              action.color === "blue" && "text-blue-500",
              action.color === "emerald" && "text-emerald-500",
              action.color === "rose" && "text-rose-500"
            )}
          />
          {action.label}
        </Link>
      ))}
    </div>
  )
}
