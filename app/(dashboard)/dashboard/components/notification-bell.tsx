"use client"

import { useEffect, useState } from "react"
import { Bell } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface NotificationItem {
  id: string
  title: string
  message: string
  read: boolean
  link: string | null
  createdAt: string
}

export default function NotificationBell() {
  const router = useRouter()
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)

  const loadNotifications = async () => {
    try {
      const response = await fetch("/api/notifications", { cache: "no-store" })
      if (!response.ok) return
      const data = await response.json()
      setNotifications(data.notifications ?? [])
    } catch {
      setNotifications([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadNotifications()

    const handleFocus = () => {
      void loadNotifications()
    }

    window.addEventListener("focus", handleFocus)
    return () => window.removeEventListener("focus", handleFocus)
  }, [])

  useEffect(() => {
    if (!open) return
    void loadNotifications()
  }, [open])

  const unreadCount = notifications.filter((item) => !item.read).length

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative rounded-xl p-2.5">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#c9a84c] text-[10px] font-semibold text-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 rounded-2xl p-2">
        <div className="px-2 py-1.5 text-sm font-semibold">Notifications</div>
        <DropdownMenuSeparator />
        {loading ? (
          <div className="px-2 py-3 text-sm text-slate-500">Loading...</div>
        ) : notifications.length === 0 ? (
          <div className="px-2 py-3 text-sm text-slate-500">
            No notifications yet.
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.some((item) => !item.read) && (
              <div className="px-2 pt-1 text-[11px] font-semibold tracking-[0.2em] text-[#c9a84c] uppercase">
                New
              </div>
            )}
            {notifications.map((item) => (
              <DropdownMenuItem
                key={item.id}
                className={`cursor-pointer rounded-xl px-2 py-3 ${
                  item.read
                    ? "bg-white text-slate-600"
                    : "bg-[#fffaf0] text-slate-900"
                }`}
                onSelect={async () => {
                  if (item.link) {
                    router.push(item.link)
                  }
                  try {
                    await fetch(`/api/notifications/${item.id}/read`, {
                      method: "PATCH",
                    })
                    await loadNotifications()
                  } catch {
                    // ignore
                  }
                }}
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium">{item.title}</span>
                    {!item.read && (
                      <span className="h-2 w-2 rounded-full bg-[#c9a84c]" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500">{item.message}</p>
                </div>
              </DropdownMenuItem>
            ))}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
