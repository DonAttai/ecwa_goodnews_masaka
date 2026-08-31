"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import clsx from "clsx"
import {
  Heart,
  LayoutDashboard,
  Users,
  ClipboardList,
  User,
  UserCog,
  Settings,
  MoreHorizontal,
  LogOut,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LayoutUser } from "../types"
import { logout } from "@/app/actions/auth"

const primaryLinks = [
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

const moreLinks = [
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

interface DashboardFooterProps {
  user: LayoutUser
}

export default function DashboardFooter({ user }: DashboardFooterProps) {
  const pathname = usePathname()
  const router = useRouter()

  const visiblePrimary = primaryLinks.filter((link) =>
    link.roles.includes(user.role)
  )

  const visibleMore = moreLinks.filter((link) => link.roles.includes(user.role))

  const isActive = (href: string) =>
    href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname.startsWith(href)

  return (
    <footer className="shrink-0">
      {/* DESKTOP FOOTER */}
      <div className="hidden border-t border-[#e2dcd5]/30 bg-white/80 px-8 py-3 backdrop-blur-xl md:flex md:items-center md:justify-between md:gap-2 md:text-sm">
        <p className="text-[#8a95a8]">
          © {new Date().getFullYear()} ECWA GOODNEWS 1, MASAKA
        </p>
        <p className="flex items-center gap-1.5 text-[#8a95a8]">
          Built with
          <Heart className="inline h-3 w-3 text-[#c9a84c]" />
          for the church
        </p>
        <p className="font-bold text-[#c9a84c]/60">Membership Management</p>
      </div>

      {/* MOBILE BOTTOM NAV */}
      <nav className="sticky bottom-0 z-30 border-t border-[#e2dcd5]/40 bg-white/90 px-1 pb-[env(safe-area-inset-bottom)] pt-1 backdrop-blur-xl md:hidden">
        <div className="flex gap-1">
          {visiblePrimary.map((link) => {
            const Icon = link.icon
            const active = isActive(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  "group flex h-14 w-full flex-1 flex-col items-center justify-center rounded-xl px-1 py-1 text-xs font-medium transition-all duration-200",
                  active
                    ? "bg-[#f7f3e6] text-[#1a2332] shadow-sm"
                    : "text-gray-600 hover:bg-[#f5f4f1] hover:text-[#1a2332]"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="mt-1 text-[10px] leading-none">
                  {link.title}
                </span>
              </Link>
            )
          })}

          {visibleMore.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex h-14 w-full flex-1 flex-col items-center justify-center rounded-xl px-1 py-1 text-xs font-medium text-gray-600 transition-all duration-200 hover:bg-[#f5f4f1] hover:text-[#1a2332]"
                >
                  <MoreHorizontal className="h-5 w-5" />
                  <span className="mt-1 text-[10px] leading-none">More</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                side="top"
                sideOffset={8}
                className="mr-1 w-48 rounded-2xl border border-[#e2dcd5] bg-white p-2 shadow-lg"
              >
                {visibleMore.map((link) => {
                  const Icon = link.icon
                  return (
                    <DropdownMenuItem
                      key={link.href}
                      className="cursor-pointer rounded-xl px-2 py-2 text-sm text-black"
                      onSelect={() => router.push(link.href)}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {link.title}
                    </DropdownMenuItem>
                  )
                })}
                <DropdownMenuSeparator className="bg-[#e8e3dc]" />
                <DropdownMenuItem
                  variant="destructive"
                  className="cursor-pointer rounded-xl px-2 py-2 text-sm"
                  onSelect={async () => {
                    await logout()
                    router.push("/login")
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </nav>
    </footer>
  )
}
