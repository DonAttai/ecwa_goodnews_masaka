"use client"

import { Button } from "@/components/ui/button"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Badge } from "@/components/ui/badge"

import { Menu, User } from "lucide-react"
import LogoutButton from "./logout-button"
import Link from "next/link"

interface DashboardHeaderProps {
  title: string
  user: {
    name: string
    role: string
  }
}

export default function DashboardHeader({ title, user }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-slate-800 bg-slate-950/80 px-6 backdrop-blur-xl">
      {/* LEFT */}
      <div className="flex items-center gap-4">
        <Button
          size="icon"
          variant="ghost"
          className="text-slate-300 hover:bg-slate-800 hover:text-white md:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            {title}
          </h1>

          <p className="text-sm text-slate-400">ECWA GOODNEWS 1, MASAKA</p>
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
              className="flex items-center gap-3 rounded-xl px-3 py-6 hover:bg-slate-800"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-blue-500 text-white">
                <User className="h-5 w-5" />
              </div>

              <div className="hidden text-left md:block">
                <p className="text-sm font-medium text-white">{user.name}</p>

                <p className="text-xs text-slate-400">Church Administrator</p>
              </div>
            </Button>
          </DropdownMenuTrigger>

          {/* <DropdownMenuContent
            align="end"
            className="w-52 border-slate-800 bg-slate-900 text-white"
          >
            <DropdownMenuItem className="cursor-pointer focus:bg-slate-800">
              <Link href="/dashboard/profile">Profile</Link>
            </DropdownMenuItem>

            <div className="p-1">
              <LogoutButton />
            </div>
          </DropdownMenuContent> */}
        </DropdownMenu>
      </div>
    </header>
  )
}
