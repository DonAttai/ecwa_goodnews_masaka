import Link from "next/link"
import Image from "next/image"
import { MapPin, Phone, Mail } from "lucide-react"
import type { SiteSettings } from "@/lib/site"
import { SERVICE_TIMES } from "@/lib/site"

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M13.5 21v-7h2.4l.4-3h-2.8V9.1c0-.9.3-1.5 1.6-1.5h1.3V4.9c-.3 0-1.1-.1-2.1-.1-2.1 0-3.6 1.3-3.6 3.7V11H8.2v3h2.5v7h2.8Z" />
    </svg>
  )
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="3.8" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8c1.6.4 7.8.4 7.8.4s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8ZM10 15.2V8.8L15.5 12 10 15.2Z" />
    </svg>
  )
}

export default function SiteFooter({ settings }: { settings: SiteSettings }) {
  const year = new Date().getFullYear()
  return (
    <footer className="bg-[#141c2b] text-white/70">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt={`${settings.churchName} logo`}
              width={44}
              height={44}
              className="h-11 w-11 rounded-full object-contain ring-1 ring-[#c9a84c]/40"
            />
            <span className="leading-tight">
              <span className="block text-sm font-bold text-white">
                {settings.churchName}
              </span>
              <span className="block text-[11px] tracking-[0.22em] text-[#e8d5a3] uppercase">
                Know Christ, Grow Together
              </span>
            </span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-6">
            {settings.welcomeMessage}
          </p>
          <div className="mt-5 flex items-center gap-2">
            {[
              { icon: FacebookIcon, label: "Facebook", href: settings.facebookUrl },
              { icon: InstagramIcon, label: "Instagram", href: settings.instagramUrl },
              { icon: YoutubeIcon, label: "YouTube", href: settings.youtubeUrl },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href ?? "/contact"}
                {...(s.href
                  ? { target: "_blank", rel: "noreferrer" }
                  : {})}
                aria-label={s.label}
                className="rounded-full border border-white/15 p-2.5 transition hover:border-[#c9a84c] hover:text-[#e8d5a3]"
              >
                <s.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-bold tracking-[0.24em] text-[#e8d5a3] uppercase">
            Visit us
          </p>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#c9a84c]" />
              {settings.address}
            </li>
            <li className="flex gap-2.5">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#c9a84c]" />
              {settings.phone}
            </li>
            <li className="flex gap-2.5">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#c9a84c]" />
              {settings.email}
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-bold tracking-[0.24em] text-[#e8d5a3] uppercase">
            Service times
          </p>
          <ul className="mt-4 space-y-3 text-sm">
            {SERVICE_TIMES.map((s) => (
              <li key={s.title}>
                <p className="font-semibold text-white">{s.day}</p>
                <p>
                  {s.title} • {s.time}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-bold tracking-[0.24em] text-[#e8d5a3] uppercase">
            Explore
          </p>
          <ul className="mt-4 grid grid-cols-2 gap-2 text-sm lg:grid-cols-1">
            {[
              { href: "/visit", label: "Plan Your Visit" },
              { href: "/about", label: "About us" },
              { href: "/sermons", label: "Sermons" },
              { href: "/events", label: "Events" },
              { href: "/give", label: "Give / Offerings" },
              { href: "/contact", label: "Prayer request" },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-white/50 sm:flex-row sm:px-6">
          <p>
            © {year} {settings.churchName}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hover:text-white">
              Leaders
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
