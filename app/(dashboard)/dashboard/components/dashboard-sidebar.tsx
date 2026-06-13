"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import clsx from "clsx"
import { useState } from "react"

import {
  LayoutDashboard,
  Users,
  UserCog,
  Settings,
  Church,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

import LogoutButton from "@/app/(dashboard)/dashboard/components/logout-button"

interface DashboardSidebarProps {
  userRole: "ADMIN" | "WORKER"
  onNavigate?: () => void
}

export default function DashboardSidebar({
  userRole,
  onNavigate,
}: DashboardSidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  const links = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      roles: ["ADMIN", "WORKER"],
    },
    {
      title: "Members",
      href: "/dashboard/members",
      icon: Users,
      roles: ["ADMIN", "WORKER"],
    },
    {
      title: "Profile",
      href: "/dashboard/profile",
      icon: User,
      roles: ["ADMIN", "WORKER"],
    },
    {
      title: "Users",
      href: "/dashboard/users",
      icon: UserCog,
      roles: ["ADMIN"],
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
      roles: ["ADMIN"],
    },
  ]

  return (
    <aside
      className={clsx(
        "flex h-full flex-col border-r border-slate-800 bg-slate-950 transition-all duration-300",
        collapsed ? "w-20" : "w-72"
      )}
    >
      {/* HEADER */}
      <div className="flex h-20 shrink-0 items-center justify-between border-b border-slate-800 px-4">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-blue-500 text-white">
            <Church className="h-5 w-5" />
          </div>

          {!collapsed && (
            <div className="leading-tight">
              <h2 className="text-sm font-bold text-white">ECWA GOODNEWS</h2>
              <p className="text-xs text-slate-400">MASAKA</p>
            </div>
          )}
        </div>

        {/* collapse button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden items-center justify-center text-slate-400 hover:text-white md:flex"
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* NAV - This will scroll if there are many items */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-4">
        {links.map((link) => {
          const hasAccess = link.roles.includes(userRole)
          if (!hasAccess) return null

          const isActive =
            link.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(link.href)

          const Icon = link.icon

          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => {
                onNavigate?.()
              }}
              className={clsx(
                "group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all",
                collapsed && "justify-center px-2",
                isActive
                  ? "bg-linear-to-r from-indigo-600 to-blue-600 text-white shadow-md"
                  : "text-slate-400 hover:bg-slate-900 hover:text-white"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />

              {!collapsed && <span>{link.title}</span>}

              {/* tooltip for collapsed mode */}
              {collapsed && (
                <span className="absolute left-20 z-50 hidden rounded-md bg-slate-800 px-2 py-1 text-xs text-white group-hover:block">
                  {link.title}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* FOOTER */}
      <div className="shrink-0 border-t border-slate-800 p-3">
        {!collapsed ? (
          <LogoutButton />
        ) : (
          <div className="flex justify-center">
            <LogoutButton />
          </div>
        )}
      </div>
    </aside>
  )
}
