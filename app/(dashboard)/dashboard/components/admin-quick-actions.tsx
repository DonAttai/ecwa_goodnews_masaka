"use client"

import { Users, ClipboardList } from "lucide-react"
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
  ]

  return (
    <div className="grid gap-4 pb-6 sm:grid-cols-2 lg:grid-cols-4">
      {actions.map((action) => (
        <Link
          key={action.label}
          href={action.href}
          className="group flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-foreground transition-all duration-300 hover:border-primary/30 hover:bg-muted hover:shadow-md hover:shadow-primary/5"
        >
          <action.icon
            className={cn(
              "h-4 w-4 transition-colors",
              action.color === "gold" && "text-primary",
              action.color === "blue" && "text-blue-500"
            )}
          />
          {action.label}
        </Link>
      ))}
    </div>
  )
}
