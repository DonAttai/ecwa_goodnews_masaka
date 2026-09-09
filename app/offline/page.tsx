import Link from "next/link"
import { WifiOff, MapPin, Phone } from "lucide-react"
import { SERVICE_TIMES } from "@/lib/site"

export const dynamic = "force-static"

/** Shown by the service worker when a page can't be reached offline. */
export default function OfflinePage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/15">
        <WifiOff className="h-8 w-8 text-primary" />
      </span>
      <h1 className="font-display mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">
        You&apos;re offline
      </h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        No internet connection right now. Your saved pages still work — or join
        us in person:
      </p>
      <div className="mt-8 w-full space-y-3 text-left">
        {SERVICE_TIMES.map((s) => (
          <div
            key={s.title}
            className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-card px-5 py-4"
          >
            <div>
              <p className="font-semibold">{s.title}</p>
              <p className="text-sm text-muted-foreground">{s.day}</p>
            </div>
            <p className="font-display text-sm whitespace-nowrap text-primary sm:text-base">
              {s.time}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="btn-gold rounded-2xl px-7 py-3.5 text-center font-bold"
        >
          Retry Home Page
        </Link>
        <a
          href="tel:+2348000000000"
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border px-7 py-3.5 font-semibold"
        >
          <Phone className="h-4 w-4" /> Call the Church
        </a>
      </div>
      <p className="mt-6 flex items-center gap-1.5 text-xs text-muted-foreground">
        <MapPin className="h-3.5 w-3.5" /> Masaka, Nasarawa State, Nigeria
      </p>
    </div>
  )
}
