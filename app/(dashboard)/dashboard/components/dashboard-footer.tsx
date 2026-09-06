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
      <div className="hidden border-t border-border/30 bg-card/80 px-8 py-3 backdrop-blur-xl md:flex md:items-center md:justify-between md:gap-2 md:text-sm">
        <p className="text-muted-foreground">
          © {new Date().getFullYear()} ECWA GOODNEWS 1, MASAKA
        </p>
        <p className="flex items-center gap-1.5 text-muted-foreground">
          Built with
          <Heart className="inline h-3 w-3 text-[#c9a84c]" />
          for the church
        </p>
        <p className="font-bold text-[#c9a84c]/60">Membership Management</p>
      </div>

      {/* MOBILE BOTTOM NAV */}
      <nav className="sticky bottom-0 z-30 border-t border-border/40 bg-card/90 px-1 pt-1 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden">
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
                    ? "bg-muted text-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
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
                  className="flex h-14 w-full flex-1 flex-col items-center justify-center rounded-xl px-1 py-1 text-xs font-medium text-muted-foreground transition-all duration-200 hover:bg-muted hover:text-foreground"
                >
                  <MoreHorizontal className="h-5 w-5" />
                  <span className="mt-1 text-[10px] leading-none">More</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                side="top"
                sideOffset={8}
                className="mr-1 w-48 rounded-2xl border border-border bg-popover p-2 shadow-lg"
              >
                {visibleMore.map((link) => {
                  const Icon = link.icon
                  return (
                    <DropdownMenuItem
                      key={link.href}
                      className="cursor-pointer rounded-xl px-2 py-2 text-sm"
                      onSelect={() => router.push(link.href)}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {link.title}
                    </DropdownMenuItem>
                  )
                })}
                <DropdownMenuSeparator />
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
