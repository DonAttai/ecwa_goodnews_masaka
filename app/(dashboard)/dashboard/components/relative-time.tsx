"use client"

import { useEffect, useState } from "react"

interface RelativeTimeProps {
  date: Date
}

export default function RelativeTime({ date }: RelativeTimeProps) {
  const [, forceUpdate] = useState(0)

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>

    function scheduleNextUpdate() {
      const now = Date.now()
      const diff = Math.floor((now - new Date(date).getTime()) / 1000)

      let delay: number

      if (diff < 60) {
        // Next second
        delay = 1000
      } else if (diff < 3600) {
        // Next minute boundary
        delay = (60 - (diff % 60)) * 1000
      } else if (diff < 86400) {
        // Next hour boundary
        delay = (3600 - (diff % 3600)) * 1000
      } else if (diff < 30 * 86400) {
        // Next day boundary
        delay = (86400 - (diff % 86400)) * 1000
      } else if (diff < 365 * 86400) {
        // Approximate month boundary
        delay = 86400 * 1000
      } else {
        // Approximate year boundary
        delay = 30 * 86400 * 1000
      }

      timeout = setTimeout(() => {
        forceUpdate((n) => n + 1)
        scheduleNextUpdate()
      }, delay)
    }

    scheduleNextUpdate()

    return () => clearTimeout(timeout)
  }, [date])

  return (
    <time dateTime={new Date(date).toISOString()}>
      {formatRelativeTime(new Date(date))}
    </time>
  )
}

function formatRelativeTime(date: Date) {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)

  if (seconds < 60) return `${seconds}s ago`

  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`

  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`

  const months = Math.floor(days / 30)
  if (months < 12) return `${months}mo ago`

  return `${Math.floor(months / 12)}y ago`
}
