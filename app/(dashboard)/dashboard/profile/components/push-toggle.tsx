"use client"

import { useCallback, useEffect, useState } from "react"
import { BellRing, BellOff } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"

type Status = "checking" | "unsupported" | "off" | "on" | "busy"

function urlBase64ToUint8Array(base64: string) {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4)
  const raw = window.atob(base64.replace(/-/g, "+").replace(/_/g, "/") + padding)
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)))
}

/** Per-device push opt-in. State reflects this browser only. */
export default function PushToggle() {
  const [status, setStatus] = useState<Status>("checking")
  const [supported] = useState(
    () =>
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      "PushManager" in window &&
      "Notification" in window
  )

  const refresh = useCallback(async () => {
    if (!supported) {
      setStatus("unsupported")
      return
    }
    try {
      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.getSubscription()
      setStatus(sub ? "on" : "off")
    } catch {
      setStatus("off")
    }
  }, [supported])

  useEffect(() => {
    void refresh()
  }, [refresh])

  async function enable() {
    setStatus("busy")
    try {
      const permission = await Notification.requestPermission()
      if (permission !== "granted") {
        toast.error("Notifications blocked — allow them in browser settings")
        setStatus("off")
        return
      }
      const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      if (!publicKey) {
        toast.error("Push not configured yet")
        setStatus("off")
        return
      }
      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      })
      const res = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          endpoint: sub.endpoint,
          keys: {
            p256dh: btoa(
              String.fromCharCode(...new Uint8Array(sub.getKey("p256dh")!))
            ),
            auth: btoa(
              String.fromCharCode(...new Uint8Array(sub.getKey("auth")!))
            ),
          },
          userAgent: navigator.userAgent.slice(0, 500),
        }),
      })
      if (!res.ok) throw new Error("subscribe failed")
      toast.success("Push notifications enabled on this device")
      setStatus("on")
    } catch {
      toast.error("Could not enable notifications")
      setStatus("off")
    }
  }

  async function disable() {
    setStatus("busy")
    try {
      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.getSubscription()
      const endpoint = sub?.endpoint
      await sub?.unsubscribe()
      if (endpoint) {
        await fetch("/api/push/subscribe", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint }),
        }).catch(() => undefined)
      }
      toast.success("Push notifications turned off")
      setStatus("off")
    } catch {
      toast.error("Could not turn off notifications")
      await refresh()
    }
  }

  if (status === "checking") {
    return (
      <p className="text-sm text-muted-foreground">Checking device status…</p>
    )
  }

  if (status === "unsupported") {
    return (
      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        <BellOff className="h-4 w-4" />
        Push isn&apos;t supported in this browser.
      </p>
    )
  }

  const on = status === "on"
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="flex items-center gap-2 font-medium text-foreground">
          <BellRing className="h-4 w-4 text-muted-foreground" />
          Push notifications
        </p>
        <p className="mt-1 max-w-md text-sm text-muted-foreground">
          {on
            ? "This device will receive alerts for approvals, payments, and announcements."
            : "Get approvals, payments, and announcements on this device — even with the app closed."}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          iPhone: install the app to your Home Screen first.
        </p>
      </div>
      <Switch
        checked={on}
        disabled={status === "busy"}
        onCheckedChange={(v) => (v ? void enable() : void disable())}
        aria-label="Toggle push notifications"
      />
    </div>
  )
}
