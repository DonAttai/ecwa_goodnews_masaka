"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import clsx from "clsx"
import {
  LayoutDashboard,
  Users,
  UserCog,
  Settings,
  Church,
  User,
  ClipboardList,
} from "lucide-react"
import { LayoutUser } from "../types"

interface DashboardSidebarProps {
  user: LayoutUser
}

export default function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname()

  const links = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      roles: ["ADMIN", "WORKER", "FINANCE", "USER"],
    },
    {
      title: "Members",
      href: "/dashboard/members",
      icon: Users,
      roles: ["ADMIN", "WORKER", "FINANCE"],
    },
    {
      title: "Requisitions",
      href: "/dashboard/requisitions",
      icon: ClipboardList,
      roles: ["ADMIN", "FINANCE", "WORKER", "USER"],
    },
    {
      title: "Profile",
      href: "/dashboard/profile",
      icon: User,
      roles: ["ADMIN", "FINANCE", "WORKER", "USER"],
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
    <aside className="flex h-full w-fit flex-col border-r border-[#e2dcd5] bg-white">
      {/* HEADER */}
      <div className="flex h-20 shrink-0 items-center justify-center px-1">
        <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-[#c9a84c] to-[#e8d5a3] shadow-lg shadow-[#c9a84c]/20">
          <Church className="h-4.5 w-4.5 text-[#1a2332]" />
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 space-y-1 px-1 py-4">
        {links.map((link) => {
          const hasAccess = link.roles.includes(user.role)
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
                "group relative flex min-h-18 w-10 flex-col items-center justify-center gap-1 rounded-2xl px-2 py-1.5 text-center text-[10px] font-medium transition-all duration-200",
                isActive
                  ? "bg-[#f5f4f1] border-l-2 border-[#c9a84c] text-[#1a2332]"
                  : "text-black hover:bg-[#f5f4f1] hover:text-[#1a2332]"
              )}
            >
              <Icon
                className={clsx(
                  "h-4 w-4 transition-colors",
                  isActive
                    ? "text-[#1a2332]"
                    : "text-[#1a2332] group-hover:text-[#1a2332]"
                )}
              />

              <span className={clsx(
                "absolute left-full top-1/2 -translate-y-1/2 ml-3 whitespace-nowrap",
                "bg-[#1a2332] text-white text-[11px] font-medium px-2 py-1 rounded",
                "opacity-0 invisible group-hover:opacity-100 group-hover:visible",
                "transition-opacity duration-200 z-10"
              )}>
                {link.title}
              </span>
            </Link>
          )

          return <div key={link.href}>{linkElement}</div>
        })}
      </nav>
    </aside>
  )
}
