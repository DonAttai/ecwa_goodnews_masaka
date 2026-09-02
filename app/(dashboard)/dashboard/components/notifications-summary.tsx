"use client"

import { useEffect, useState } from "react"
import { Bell, BellOff } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { cn } from "@/lib/utils"
import RelativeTime from "./relative-time"

interface NotificationItem {
  id: string
  title: string
  message: string
  read: boolean
  link: string | null
  createdAt: string
}

export default function NotificationsSummary() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [loading, setLoading] = useState(true)

  const loadNotifications = async () => {
    try {
      const response = await fetch("/api/notifications", { cache: "no-store" })
      if (!response.ok) return
      const data = await response.json()
      setNotifications((data.notifications ?? []).slice(0, 3))
    } catch {
      setNotifications([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadNotifications()
  }, [])

  const unread = notifications.filter((n) => !n.read)

  return (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <Bell className="h-4 w-4 text-primary" />
          Notifications
        </CardTitle>
        {unread.length > 0 && (
          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
            {unread.length} new
          </span>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="h-14 animate-pulse rounded-lg bg-muted"
                aria-hidden="true"
              />
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-xl bg-muted/50 p-6 text-center">
            <BellOff
              className="h-6 w-6 text-muted-foreground"
              aria-hidden="true"
            />
            <p className="text-sm text-muted-foreground">
              No notifications yet.
            </p>
          </div>
        ) : (
          <>
            {notifications.map((item) => (
              <div
                key={item.id}
                className={cn(
                  "rounded-xl border p-3 transition-colors",
                  item.read
                    ? "border-border bg-card"
                    : "border-primary/30 bg-primary/5"
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-foreground">
                    {item.title}
                  </span>
                  {!item.read && (
                    <span
                      className="h-2 w-2 shrink-0 rounded-full bg-primary"
                      aria-hidden="true"
                    />
                  )}
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {item.message}
                </p>
                <p className="mt-1 text-xs text-primary/60">
                  <RelativeTime date={new Date(item.createdAt)} />
                </p>
              </div>
            ))}
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="w-full text-primary"
            >
              <Link href="/dashboard">View all notifications</Link>
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
