"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, Settings, UserCog, ExternalLink, Globe, Search } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { logout } from "@/app/actions/auth"
import NotificationBell from "./notification-bell"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/ui/status-badge"
import { getInitials } from "../utils"

const TITLE_MAP: Record<string, { title: string; eyebrow: string }> = {
  "/dashboard": { title: "Overview", eyebrow: "Dashboard" },
  "/dashboard/members": { title: "Members", eyebrow: "People" },
  "/dashboard/requisitions": { title: "Requisitions", eyebrow: "Finance" },
  "/dashboard/users": { title: "Team", eyebrow: "Manage" },
  "/dashboard/settings": { title: "Settings", eyebrow: "Manage" },
  "/dashboard/profile": { title: "Profile", eyebrow: "Account" },
}

function titleFor(pathname: string) {
  const keys = Object.keys(TITLE_MAP).sort((a, b) => b.length - a.length)
  for (const k of keys) {
    if (k === "/dashboard" ? pathname === k : pathname.startsWith(k)) return TITLE_MAP[k]
  }
  return { title: "Dashboard", eyebrow: "Overview" }
}

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
  const canManageSite = isAdmin || user.role === "EDITOR"
  const resolved = titleFor(pathname)
  const crumbs = pathname.split("/").filter(Boolean).slice(1)

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between gap-3 border-b border-border/50 bg-card/80 px-4 backdrop-blur-xl sm:h-20 sm:px-8">
      {/* LEFT */}
      <div className="flex min-w-0 items-center gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-bold tracking-[0.22em] text-[#8a6d1b] uppercase dark:text-[#e8d5a3]">
            {resolved.eyebrow}
          </p>
          <h1 className="truncate text-xl font-bold text-foreground sm:text-2xl">
            {title === "Dashboard" ? resolved.title : title}
          </h1>
          {crumbs.length > 0 && (
            <nav aria-label="Breadcrumb" className="hidden text-xs text-muted-foreground sm:block">
              <ol className="flex items-center gap-1">
                {crumbs.map((c, i) => (
                  <li key={`${c}-${i}`} className="flex items-center gap-1">
                    {i > 0 && <span aria-hidden>/</span>}
                    <span className={i === crumbs.length - 1 ? "font-medium text-foreground" : ""}>
                      {c.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase())}
                    </span>
                  </li>
                ))}
              </ol>
            </nav>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          aria-label="Search (Ctrl+K)"
          onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true }))}
          className="hidden h-10 items-center gap-2 rounded-xl border border-border px-3 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground md:inline-flex"
        >
          <Search className="h-4 w-4" />
          Search…
          <kbd className="rounded-md border border-border bg-muted px-1.5 py-0.5 text-[11px] font-semibold">⌘K</kbd>
        </button>
        <ModeToggle />
        <NotificationBell iconOnly className="h-10 w-10" />
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          aria-label="View website"
          className="hidden h-10 items-center gap-2 rounded-xl border border-border px-3 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground sm:inline-flex"
        >
          <Globe className="h-4 w-4" />
          View website
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
        <StatusBadge status={user.role} className="hidden sm:inline-flex" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-lg"
              className="size-11 rounded-full bg-[#c9a84c]/15 font-semibold text-[#1a2332] hover:bg-[#c9a84c]/25 dark:text-white"
              aria-label="Profile actions"
            >
              <span className="text-base font-semibold tracking-tight">
                {getInitials(user.name)}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="mr-4 w-56 rounded-2xl border border-border bg-popover p-2 shadow-lg">
            <DropdownMenuLabel className="text-sm text-muted-foreground">
              Signed in as
            </DropdownMenuLabel>
            <p className="px-2 text-sm wrap-break-word text-foreground">
              {user.email}
            </p>
            <DropdownMenuSeparator />
            {isAdmin && (
              <DropdownMenuItem
                className="cursor-pointer rounded-xl px-2 py-2"
                onSelect={() => router.push("/dashboard/users")}
              >
                <UserCog className="mr-1 h-4 w-4" />
                Users
              </DropdownMenuItem>
            )}
            {canManageSite && (
              <DropdownMenuItem
                className="cursor-pointer rounded-xl px-2 py-2"
                onSelect={() => router.push("/dashboard/settings")}
              >
                <Settings className="mr-1 h-4 w-4" />
                Settings
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              className="cursor-pointer rounded-xl px-2 py-2"
              onSelect={() => window.open("/", "_blank", "noreferrer")}
            >
              <Globe className="mr-1 h-4 w-4" />
              View website
            </DropdownMenuItem>
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
