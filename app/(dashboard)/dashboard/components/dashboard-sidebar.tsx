"use client"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import clsx from "clsx"
import {
  LayoutDashboard,
  Users,
  UserCog,
  Settings,
  ClipboardList,
  User,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"
import { LayoutUser } from "../types"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface DashboardSidebarProps {
  user: LayoutUser
  pendingCount?: number
}

type NavItem = {
  title: string
  href: string
  icon: typeof Users
  roles: string[]
  badge?: number
}

const GROUPS: { label: string; items: NavItem[] }[] = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["ADMIN", "ELDER", "PASTOR", "WORKER", "FINANCE"] },
    ],
  },
  {
    label: "People",
    items: [{ title: "Members", href: "/dashboard/members", icon: Users, roles: ["ADMIN", "ELDER", "PASTOR", "FINANCE", "EDITOR"] }],
  },
  {
    label: "Finance",
    items: [{ title: "Requisitions", href: "/dashboard/requisitions", icon: ClipboardList, roles: ["ADMIN", "FINANCE", "ELDER", "WORKER", "PASTOR"] }],
  },
  {
    label: "Manage",
    items: [
      { title: "Users", href: "/dashboard/users", icon: UserCog, roles: ["ADMIN"] },
      { title: "Settings", href: "/dashboard/settings", icon: Settings, roles: ["ADMIN", "EDITOR"] },
      { title: "Profile", href: "/dashboard/profile", icon: User, roles: ["ADMIN", "FINANCE", "ELDER", "WORKER", "PASTOR", "EDITOR"] },
    ],
  },
]

export default function DashboardSidebar({ user, pendingCount = 0 }: DashboardSidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem("ecwa-sidebar") === "collapsed")
    } catch { /* noop */ }
  }, [])

  function toggle() {
    setCollapsed((v) => {
      try {
        localStorage.setItem("ecwa-sidebar", v ? "expanded" : "collapsed")
      } catch { /* noop */ }
      return !v
    })
  }

  return (
    <TooltipProvider delayDuration={200}>
      <aside
        className={cn(
          "flex h-full flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-200",
          collapsed ? "w-[76px]" : "w-60"
        )}
      >
        {/* HEADER */}
        <div className={cn("flex h-16 shrink-0 items-center gap-3 border-b border-sidebar-border px-4 sm:h-20", collapsed && "justify-center px-2")}>
          <span className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white/5 ring-1 ring-[#c9a84c]/40">
            <Image src="/logo.png" alt="ECWA Goodnews 1, Masaka logo" fill sizes="40px" className="object-contain" priority />
          </span>
          {!collapsed && (
            <span className="min-w-0 leading-tight">
              <span className="block truncate text-[13px] font-bold text-white">ECWA Goodnews</span>
              <span className="block text-[10px] tracking-[0.2em] text-[#e8d5a3] uppercase">Masaka</span>
            </span>
          )}
        </div>

        {/* NAVIGATION */}
        <nav aria-label="Dashboard" className="sidebar-scrollbar flex-1 space-y-5 overflow-y-auto px-2.5 py-4">
          {GROUPS.map((g) => {
            const visible = g.items.filter((l) => l.roles.includes(user.role))
            if (visible.length === 0) return null
            return (
              <div key={g.label}>
                {!collapsed && (
                  <p className="px-2.5 pb-1.5 text-[10px] font-bold tracking-[0.22em] text-white/40 uppercase">{g.label}</p>
                )}
                <div className="space-y-1">
                  {visible.map((link) => {
                    const isActive =
                      link.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(link.href)
                    const Icon = link.icon
                    const badge = link.href === "/dashboard/requisitions" ? pendingCount : 0
                    const el = (
                      <Link
                        href={link.href}
                        prefetch
                        aria-current={isActive ? "page" : undefined}
                        className={clsx(
                          "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                          collapsed && "justify-center px-0",
                          isActive
                            ? "bg-white/10 text-white"
                            : "text-white/60 hover:bg-white/5 hover:text-white"
                        )}
                      >
                        {isActive && (
                          <span aria-hidden className="absolute top-1/2 left-0 h-7 w-1 -translate-y-1/2 rounded-r-full bg-[#c9a84c]" />
                        )}
                        <Icon className={clsx("h-[18px] w-[18px] shrink-0", isActive ? "text-[#e8d5a3]" : "text-white/50 group-hover:text-white")} />
                        {!collapsed && <span className="min-w-0 flex-1 truncate">{link.title}</span>}
                        {!collapsed && badge > 0 && (
                          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#c9a84c] px-1.5 text-[11px] font-bold text-[#141c2b]">
                            {badge > 99 ? "99+" : badge}
                          </span>
                        )}
                        {collapsed && badge > 0 && (
                          <span aria-hidden className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#c9a84c]" />
                        )}
                      </Link>
                    )
                    if (collapsed) {
                      return (
                        <Tooltip key={link.href}>
                          <TooltipTrigger asChild>{el}</TooltipTrigger>
                          <TooltipContent side="right">{link.title}{badge > 0 ? ` (${badge} pending)` : ""}</TooltipContent>
                        </Tooltip>
                      )
                    }
                    return <div key={link.href}>{el}</div>
                  })}
                </div>
              </div>
            )
          })}
        </nav>

        <div className="shrink-0 border-t border-sidebar-border p-2.5">
          <button
            type="button"
            onClick={toggle}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-medium text-white/50 transition hover:bg-white/5 hover:text-white"
          >
            {collapsed ? <ChevronsRight className="h-4 w-4" /> : <><ChevronsLeft className="h-4 w-4" /> Collapse</>}
          </button>
        </div>
      </aside>
    </TooltipProvider>
  )
}
