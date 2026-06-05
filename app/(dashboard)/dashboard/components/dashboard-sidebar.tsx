"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  LayoutDashboard,
  Users,
  UserCog,
  Settings,
  Church,
  User,
} from "lucide-react"

import LogoutButton from "@/app/(dashboard)/dashboard/components/logout-button"

import clsx from "clsx"

interface DashboardSidebarProps {
  userRole: "ADMIN" | "WORKER"
}

export default function DashboardSidebar({ userRole }: DashboardSidebarProps) {
  const pathname = usePathname()

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
    <aside className="sticky-top-0 hidden h-screen w-72 flex-col border-r border-slate-800 bg-slate-950 md:flex">
      {/* LOGO */}
      <div className="flex h-20 items-center gap-3 border-b border-slate-800 px-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-500 to-blue-500 text-white shadow-lg">
          <Church className="h-6 w-6" />
        </div>

        <div>
          <h2 className="text-lg font-bold text-white">ECWA GOODNEWS 1</h2>

          <p className="text-xs text-slate-400">MASAKA</p>
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 space-y-2 px-4 py-6">
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
              className={clsx(
                "flex items-center gap-4 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200",

                isActive
                  ? "bg-linear-to-r from-indigo-600 to-blue-600 text-white shadow-lg"
                  : "text-slate-400 hover:bg-slate-900 hover:text-white"
              )}
            >
              <Icon className="h-5 w-5" />

              <span>{link.title}</span>
            </Link>
          )
        })}
      </nav>

      {/* FOOTER */}
      <div className="border-t border-slate-800 p-4">
        <LogoutButton />
      </div>
    </aside>
  )
}
