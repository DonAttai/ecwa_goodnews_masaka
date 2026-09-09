"use client"

import { useEffect } from "react"

/** Registers the PWA service worker once per session. */
export default function RegisterSW() {
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !("serviceWorker" in navigator) ||
      process.env.NODE_ENV !== "production"
    ) {
      return
    }
    const id = window.setTimeout(() => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Offline-first is progressive enhancement; never break the app.
      })
    }, 1500)
    return () => window.clearTimeout(id)
  }, [])

  return null
}
