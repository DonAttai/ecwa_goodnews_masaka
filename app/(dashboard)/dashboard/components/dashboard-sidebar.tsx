"use client"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import clsx from "clsx"
import {
  LayoutDashboard,
  Users,
  UserCog,
  Settings,
  Church,
  User,
  ClipboardList,
  LogOut,
  CircleUserRound,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { logout } from "@/app/actions/auth"
import { toast } from "sonner"
import { LayoutUser } from "../types"
import { getInitials } from "../utils"

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
  ]

  const router = useRouter()
  const isAdmin = user.role === "ADMIN"

  const handleLogout = async () => {
    await logout()
    toast.success("You have been logged out.")
    router.push("/login")
  }

  return (
    <aside className="flex h-full w-fit flex-col border-r border-[#e2dcd5] bg-white">
      {/* HEADER */}
      <div className="flex h-20 shrink-0 items-center justify-center px-1">
        <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-[#c9a84c] to-[#e8d5a3] shadow-lg shadow-[#c9a84c]/20">
          <Church className="h-4.5 w-4.5 text-[#1a2332]" />
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-1 py-4">
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
                "group relative flex min-h-18 w-full flex-col items-center justify-center gap-1 rounded-2xl px-2 py-1.5 text-center text-[10px] font-medium transition-all duration-200",
                isActive
                  ? "bg-linear-to-r from-[#c9a84c]/15 to-[#c9a84c]/5 text-[#1a2332] shadow-sm"
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

              <span className="leading-tight">{link.title}</span>
            </Link>
          )

          return <div key={link.href}>{linkElement}</div>
        })}
      </nav>

      {/* USER ACTIONS */}
      <div className="px-2 py-3">
        <div className="mx-auto flex w-full max-w-40 flex-col items-center justify-center space-y-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon-lg"
                className="size-11 rounded-full bg-[#c9a84c]/15 font-semibold text-[#1a2332] hover:bg-[#c9a84c]/25"
                aria-label="Profile actions"
              >
                <span className="text-base font-semibold tracking-tight">
                  {getInitials(user.name)}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="ml-16 w-44 rounded-2xl border border-[#e2dcd5] bg-white p-2 text-sm text-black shadow-xl"
            >
              <DropdownMenuLabel className="text-sm text-muted-foreground">
                Signed in as
              </DropdownMenuLabel>
              <p className="px-2 wrap-break-word text-black">{user.email}</p>
              <DropdownMenuSeparator className="bg-[#e8e3dc]" />
              {isAdmin && (
                <DropdownMenuItem
                  className="cursor-pointer rounded-xl px-2 py-2 hover:bg-[#2e3a50]"
                  onSelect={() => router.push("/dashboard/users")}
                >
                  <UserCog className="mr-1 h-4 w-4" />
                  Users
                </DropdownMenuItem>
              )}
              {isAdmin && (
                <DropdownMenuItem
                  className="cursor-pointer rounded-xl px-2 py-2 hover:bg-[#2e3a50]"
                  onSelect={() => router.push("/dashboard/settings")}
                >
                  <Settings className="mr-1 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                variant="destructive"
                className="cursor-pointer rounded-xl px-2 py-2 text-red-400 data-highlighted:bg-red-200 data-highlighted:text-red-700"
                onSelect={handleLogout}
              >
                <LogOut className="mr-1 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </aside>
  )
}
