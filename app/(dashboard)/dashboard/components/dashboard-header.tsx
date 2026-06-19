"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Menu, User, Bell, Search, Settings, LogOut } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

import { useSidebar } from "./sidebar-context"
import { usePathname, useRouter } from "next/navigation"
import { logout } from "@/app/actions/auth"
import Link from "next/link"

interface DashboardHeaderProps {
  title: string
  user: {
    name: string
    role: string
  }
}

export default function DashboardHeader({ title, user }: DashboardHeaderProps) {
  const { setOpen } = useSidebar()
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

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }
  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b border-[#e2dcd5]/50 bg-white/80 px-4 backdrop-blur-xl sm:h-20 sm:px-8">
      {/* LEFT */}
      <div className="flex items-center gap-4">
        <Button
          size="icon"
          variant="ghost"
          className="text-[#4a5568] hover:bg-[#f8f6f3] hover:text-[#1a2332] md:hidden"
          onClick={() => setOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>

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

      {/* RIGHT */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Role Badge */}
        <Badge className="hidden border-[#c9a84c]/30 bg-[#c9a84c]/10 px-3 py-1 text-xs font-medium text-[#c9a84c] sm:flex">
          {user.role}
        </Badge>

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-3 rounded-xl px-2 py-1.5 transition-all hover:bg-[#f8f6f3] md:px-3"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-[#c9a84c] to-[#e8d5a3] text-[#1a2332] shadow-md shadow-[#c9a84c]/20">
                <User className="h-4 w-4" />
              </div>

              <div className="hidden text-left md:block">
                <p className="text-sm font-medium text-[#1a2332]">
                  {user.name}
                </p>
                <p className="text-xs text-[#8a95a8]">Church Administrator</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 rounded-2xl border-[#e2dcd5]/50 bg-white p-2 shadow-xl"
          >
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium text-[#1a2332]">{user.name}</p>
              <p className="text-xs text-[#8a95a8]">{user.role}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer rounded-xl text-[#4a5568] hover:bg-[#f8f6f3] hover:text-[#1a2332]"
              onSelect={() => router.push("/dashboard/profile")}
            >
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            {isAdmin && (
              <DropdownMenuItem
                className="cursor-pointer rounded-xl text-[#4a5568] hover:bg-[#f8f6f3] hover:text-[#1a2332]"
                onSelect={() => router.push("/dashboard/settings")}
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
              {/* <LogoutButton /> */}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
