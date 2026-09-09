"use client"

import { useEffect, useState } from "react"

const LAGOS_OFFSET_MIN = 60 // Africa/Lagos is UTC+1, no DST

/** Next Sunday 08:00 (WAT, UTC+1) as a UTC timestamp. */
export function nextServiceTimestamp(nowUtc: number): number {
  // Shift so UTC getters read Lagos (WAT) wall time, regardless of viewer TZ.
  const lagosNow = new Date(nowUtc + LAGOS_OFFSET_MIN * 60_000)
  const d = new Date(lagosNow)
  d.setUTCHours(8, 0, 0, 0)
  // Days until Sunday (0). If today is Sunday but past 08:00, jump a week.
  let add = (7 - d.getUTCDay()) % 7
  if (add === 0 && lagosNow.getTime() >= d.getTime()) add = 7
  d.setUTCDate(d.getUTCDate() + add)
  return d.getTime() - LAGOS_OFFSET_MIN * 60_000
}

function parts(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000))
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    mins: Math.floor((s % 3600) / 60),
    secs: s % 60,
  }
}

/** Live countdown to the next Sunday celebration service. */
export default function ServiceCountdown() {
  const [now, setNow] = useState<number | null>(null)

  useEffect(() => {
    setNow(Date.now())
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])

  if (now === null) {
    return (
      <div className="flex items-center gap-2 text-sm text-white/70">
        <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-[#c9a84c]" />
        Sundays • 8:00 AM
      </div>
    )
  }

  const { days, hours, mins, secs } = parts(nextServiceTimestamp(now) - now)
  const units = [
    { v: days, l: "days" },
    { v: hours, l: "hrs" },
    { v: mins, l: "min" },
    { v: secs, l: "sec" },
  ]

  return (
    <div className="flex items-center gap-3 sm:gap-4">
      <span className="hidden items-center gap-2 text-xs font-semibold tracking-[0.2em] text-white/70 uppercase sm:inline-flex">
        <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-[#c9a84c]" />
        Next service
      </span>
      <div className="flex items-center gap-1.5 sm:gap-2">
        {units.map((u) => (
          <div
            key={u.l}
            className="min-w-[3.25rem] rounded-xl border border-white/15 bg-white/10 px-2 py-1.5 text-center backdrop-blur-md sm:min-w-[3.75rem]"
          >
            <p className="font-display text-lg leading-none font-semibold text-white tabular-nums sm:text-xl">
              {String(u.v).padStart(2, "0")}
            </p>
            <p className="mt-1 text-[10px] tracking-[0.18em] text-white/60 uppercase">
              {u.l}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
