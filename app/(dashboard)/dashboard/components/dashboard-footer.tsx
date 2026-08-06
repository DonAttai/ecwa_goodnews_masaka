"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import clsx from "clsx"
import {
  Heart,
  LayoutDashboard,
  Users,
  ClipboardList,
  User,
} from "lucide-react"
import { LayoutUser } from "../types"

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
    roles: ["ADMIN", "WORKER", "FINANCE", "USER"],
  },
  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: User,
    roles: ["ADMIN", "WORKER", "FINANCE", "USER"],
  },
]

interface DashboardFooterProps {
  user: LayoutUser
}

export default function DashboardFooter({ user }: DashboardFooterProps) {
  const pathname = usePathname()

  return (
    <footer className="shrink-0 border-t border-[#e2dcd5]/30 bg-white/80 px-4 py-3 backdrop-blur-xl sm:px-8">
      <div className="hidden text-[#8a95a8] md:flex md:items-center md:justify-between md:gap-2 md:text-left md:text-sm">
        <p>© {new Date().getFullYear()} ECWA GOODNEWS 1, MASAKA</p>
        <p className="flex items-center gap-1.5">
          Built with
          <Heart className="inline h-3 w-3 text-[#c9a84c]" />
          for the church
        </p>
        <p className="font-bold text-[#c9a84c]/60">Membership Management</p>
      </div>
      <div className="mt-2 grid grid-cols-4 gap-2 md:hidden">
        {links
          .filter((link) => link.roles.includes(user.role))
          .map((link) => {
            const Icon = link.icon
            const isActive =
              link.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  "group flex h-16 w-full flex-col items-center justify-center rounded-xl px-2 py-1 text-xs font-medium transition-all duration-200",
                  isActive
                    ? "bg-[#f7f3e6] text-[#1a2332] shadow-sm"
                    : "text-gray-600 hover:text-[#1a2332]"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="mt-1 text-[11px] leading-none">
                  {link.title}
                </span>
              </Link>
            )
          })}
      </div>
    </footer>
  )
}
