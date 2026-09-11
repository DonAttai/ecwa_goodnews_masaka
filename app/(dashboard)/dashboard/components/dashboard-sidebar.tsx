"use client"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import clsx from "clsx"
import {
  LayoutDashboard,
  Users,
  UserCog,
  Settings,
  ClipboardList,
  User,
} from "lucide-react"
import { LayoutUser } from "../types"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

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
      // EDITOR excluded: /dashboard redirects them to /members, so showing
      // the link would bounce them with no explanation.
      roles: ["ADMIN", "ELDER", "PASTOR", "WORKER", "FINANCE"],
    },
    {
      title: "Members",
      href: "/dashboard/members",
      icon: Users,
      roles: ["ADMIN", "ELDER", "PASTOR", "FINANCE", "EDITOR"],
    },
    {
      title: "Requisitions",
      href: "/dashboard/requisitions",
      icon: ClipboardList,
      roles: ["ADMIN", "FINANCE", "ELDER", "WORKER", "PASTOR"],
    },
    {
      title: "Profile",
      href: "/dashboard/profile",
      icon: User,
      roles: ["ADMIN", "FINANCE", "ELDER", "WORKER", "PASTOR", "EDITOR"],
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
      roles: ["ADMIN", "EDITOR"],
    },
  ]

  return (
    <aside className="flex h-full w-fit flex-col border-r border-border bg-card">
      {/* HEADER */}
      <div className="flex h-20 shrink-0 items-center justify-center px-1">
        <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl shadow-md">
          <Image
            src="/logo.png"
            alt="ECWA Goodnews 1, Masaka logo"
            fill
            sizes="44px"
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* NAVIGATION */}
      <TooltipProvider delayDuration={200}>
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
                  "group relative flex min-h-18 w-10 flex-col items-center justify-center gap-1 rounded-2xl px-2 py-1.5 text-center text-[11px] font-medium transition-all duration-200",
                  isActive
                    ? "border-l-2 border-primary bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon
                  className={clsx(
                    "h-4 w-4 transition-colors",
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground group-hover:text-foreground"
                  )}
                />
              </Link>
            )

            return (
              <Tooltip key={link.href}>
                <TooltipTrigger asChild>{linkElement}</TooltipTrigger>
                <TooltipContent side="right">
                  {link.title}
                </TooltipContent>
              </Tooltip>
            )
          })}
        </nav>
      </TooltipProvider>
    </aside>
  )
}
