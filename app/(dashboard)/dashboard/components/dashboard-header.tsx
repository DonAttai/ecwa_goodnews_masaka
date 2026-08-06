"use client"

import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, Settings, UserCog } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { logout } from "@/app/actions/auth"
import NotificationBell from "./notification-bell"
import { Button } from "@/components/ui/button"
import { getInitials } from "../utils"

interface DashboardHeaderProps {
  title: string
  user: {
    name: string
    email: string
    role: string
    department: { id: string; name: string } | null
  }
}

export default function DashboardHeader({ title, user }: DashboardHeaderProps) {
  const pathname = usePathname()
  const router = useRouter()
  const isAdmin = user.role === "ADMIN"
  // Generate breadcrumb from pathname
  const getBreadcrumb = () => {
    const segments = pathname.split("/").filter(Boolean)
    if (segments.length <= 1) return null
    return segments
      .slice(1)
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(" / ")
  }

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b border-[#e2dcd5]/50 bg-white/80 px-4 backdrop-blur-xl sm:h-20 sm:px-8">
      {/* LEFT */}
      <div className="flex items-center">
        <div>
          <h1 className="text-xl font-bold text-[#1a2332] sm:text-2xl">
            {title}
          </h1>
          {getBreadcrumb() && (
            <p className="text-xs text-[#c9a84c] sm:text-sm">
              {getBreadcrumb()}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <NotificationBell iconOnly className="h-10 w-10" />
        <Badge className="hidden border-[#c9a84c]/30 bg-[#c9a84c]/10 px-3 py-1 text-xs font-medium text-[#c9a84c] sm:flex">
          {user.role}
        </Badge>

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
          <DropdownMenuContent className="mr-4 w-56 rounded-2xl border border-[#e2dcd5] bg-white p-2 shadow-lg">
            <DropdownMenuLabel className="text-sm text-muted-foreground">
              Signed in as
            </DropdownMenuLabel>
            <p className="px-2 text-sm wrap-break-word text-black">
              {user.email}
            </p>
            <DropdownMenuSeparator className="bg-[#e8e3dc]" />
            {isAdmin && (
              <DropdownMenuItem
                className="cursor-pointer rounded-xl px-2 py-2 text-black"
                onSelect={() => router.push("/dashboard/users")}
              >
                <UserCog className="mr-1 h-4 w-4" />
                Users
              </DropdownMenuItem>
            )}
            {isAdmin && (
              <DropdownMenuItem
                className="cursor-pointer rounded-xl px-2 py-2 text-black"
                onSelect={() => router.push("/dashboard/settings")}
              >
                <Settings className="mr-1 h-4 w-4" />
                Settings
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              variant="destructive"
              className="cursor-pointer rounded-xl px-2 py-2"
              onSelect={async () => {
                await logout()
                router.push("/login")
              }}
            >
              <LogOut className="mr-1 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
