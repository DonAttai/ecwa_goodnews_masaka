"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Menu, User } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { useSidebar } from "./sidebar-context"

interface DashboardHeaderProps {
  title: string
  user: {
    name: string
    role: string
  }
}

export default function DashboardHeader({ title, user }: DashboardHeaderProps) {
  const { setOpen } = useSidebar()

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b border-slate-800 bg-slate-950/80 px-4 backdrop-blur-xl sm:h-20 sm:px-6">
      {/* LEFT */}
      <div className="flex items-center gap-4">
        <Button
          size="icon"
          variant="ghost"
          className="text-slate-300 hover:bg-slate-800 hover:text-white md:hidden"
          onClick={() => setOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div>
          <h1 className="text-xl font-bold text-white sm:text-2xl">{title}</h1>

          <p className="text-xs text-slate-400 sm:text-sm">
            ECWA GOODNEWS 1, MASAKA
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        <Badge className="border-none bg-indigo-500/20 text-indigo-300">
          {user.role}
        </Badge>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="hidden items-center gap-3 rounded-xl px-3 py-2 hover:bg-slate-800 md:flex"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-blue-500 text-white">
                <User className="h-5 w-5" />
              </div>

              <div className="hidden text-left md:block">
                <p className="text-sm font-medium text-white">{user.name}</p>
                <p className="text-xs text-slate-400">Church Administrator</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
        </DropdownMenu>
      </div>
    </header>
  )
}
