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
  X,
} from "lucide-react"
import { SheetClose } from "@/components/ui/sheet"

interface DashboardSidebarProps {
  userRole: "ADMIN" | "WORKER"
  isMobile?: boolean
}

export default function DashboardSidebar({
  userRole,
  isMobile = false,
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
        "flex h-full flex-col border-r border-[#2a3444] bg-[#1a2332] transition-all duration-300",
        collapsed ? "w-20" : "w-72"
      )}
    >
      {/* HEADER */}
      <div className="flex h-20 shrink-0 items-center justify-between border-b border-[#2a3444] px-4">
        {/* Church Branding */}
        <div className="flex items-center gap-3 overflow-hidden">
          {/* Logo Icon - Hidden on Mobile */}
          {!isMobile && (
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-[#c9a84c] to-[#e8d5a3] shadow-lg shadow-[#c9a84c]/20">
              <Church className="h-5 w-5 text-[#1a2332]" />
              <div className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-[#c9a84c] ring-2 ring-[#1a2332]" />
            </div>
          )}

          {/* Text - Always visible (but can be adjusted) */}
          <div className="leading-tight">
            <h2 className="text-sm font-bold tracking-wide text-white">
              ECWA GOODNEWS 1
            </h2>
            <p className="text-xs text-[#c9a84c]/70">MASAKA</p>
          </div>
        </div>

        {/* Mobile Close Button */}
        {isMobile && (
          <SheetClose asChild>
            <button
              className="rounded-lg p-2 text-[#c9a84c]/70 transition-colors hover:bg-[#2a3444] hover:text-[#c9a84c] md:hidden"
              aria-label="Close sidebar"
            >
              <X className="h-6 w-6" />
            </button>
          </SheetClose>
        )}

        {/* Desktop Collapse Button */}
        {!isMobile && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden items-center justify-center rounded-lg text-[#c9a84c]/50 transition-all hover:bg-[#2a3444] hover:text-[#c9a84c] md:flex"
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </button>
        )}
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-6">
        {links.map((link) => {
          const hasAccess = link.roles.includes(userRole)
          if (!hasAccess) return null

          const isActive =
            link.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(link.href)

          const Icon = link.icon

          const linkElement = (
            <Link
              href={link.href}
              prefetch={true}
              className={clsx(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                collapsed && "justify-center px-2",
                isActive
                  ? "bg-linear-to-r from-[#c9a84c]/20 to-[#c9a84c]/5 text-[#c9a84c] shadow-sm"
                  : "text-[#8a95a8] hover:bg-[#2a3444] hover:text-white"
              )}
            >
              {isActive && (
                <span className="absolute top-1/2 left-0 h-8 w-0.5 -translate-y-1/2 rounded-r-full bg-[#c9a84c] shadow-sm shadow-[#c9a84c]/50" />
              )}

              <Icon
                className={clsx(
                  "h-5 w-5 shrink-0 transition-colors",
                  isActive
                    ? "text-[#c9a84c]"
                    : "text-[#8a95a8] group-hover:text-white"
                )}
              />

              {!collapsed && <span>{link.title}</span>}

              {collapsed && (
                <span className="absolute left-16 z-50 hidden rounded-lg bg-[#2a3444] px-3 py-1.5 text-xs text-white shadow-xl group-hover:block">
                  {link.title}
                </span>
              )}
            </Link>
          )

          return (
            <div key={link.href}>
              {isMobile ? (
                <SheetClose asChild>{linkElement}</SheetClose>
              ) : (
                linkElement
              )}
            </div>
          )
        })}
      </nav>
    </aside>
  )
}
