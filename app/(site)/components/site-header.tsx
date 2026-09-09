"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Menu, X, MapPin } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"
import { cn } from "@/lib/utils"

const NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/sermons", label: "Sermons" },
  { href: "/events", label: "Events" },
  { href: "/ministries", label: "Ministries" },
  { href: "/contact", label: "Contact" },
]

export default function SiteHeader({
  churchName,
  address,
}: {
  churchName: string
  address?: string
}) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50">
      {/* Utility bar */}
      <div className="bg-[#141c2b] text-white/75">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-1.5 text-[11px] tracking-wide sm:px-6 sm:text-xs">
          <p className="flex min-w-0 flex-1 items-center gap-1.5 overflow-hidden">
            <MapPin className="h-3 w-3 shrink-0 text-[#c9a84c]" />
            <span className="truncate whitespace-nowrap sm:hidden">
              Sundays 8 AM • Tuesdays 5 PM
            </span>
            <span className="hidden truncate whitespace-nowrap sm:inline">
              Sundays 8 AM • Tuesdays 5 PM
              {address ? ` • ${address}` : " • Masaka"}
            </span>
          </p>
          <div className="flex shrink-0 items-center gap-3 whitespace-nowrap">
            <Link href="/give" className="hidden hover:text-white sm:inline">
              Give
            </Link>
            <Link href="/gallery" className="hidden hover:text-white sm:inline">
              Gallery
            </Link>
            <Link href="/login" className="text-white/50 hover:text-white">
              Leaders
            </Link>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="border-b border-border bg-card/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt={`${churchName} logo`}
              width={44}
              height={44}
              className="h-11 w-11 rounded-full object-contain ring-1 ring-[#c9a84c]/40"
              priority
            />
            <span className="leading-tight">
              <span className="block text-sm font-bold tracking-tight sm:text-base">
                {churchName}
              </span>
              <span className="block text-[11px] tracking-[0.22em] text-primary uppercase">
                Masaka
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm font-medium transition",
                    active
                      ? "bg-primary/15 text-foreground"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
            <Link
              href="/visit"
              className="btn-gold ml-2 rounded-xl px-5 py-2.5 text-sm font-bold"
            >
              Plan Your Visit
            </Link>
          </nav>

          <div className="flex items-center gap-2 lg:hidden">
            <ModeToggle />
            <button
              className="rounded-lg border border-border p-2"
              aria-label="Toggle menu"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
          <div className="hidden lg:block">
            <ModeToggle />
          </div>
        </div>

        {open && (
          <nav className="border-t border-border bg-card px-4 py-3 lg:hidden">
            <div className="grid gap-1">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-lg px-3 py-2.5 text-sm font-medium",
                    pathname === item.href
                      ? "bg-primary/15 text-foreground"
                      : "text-muted-foreground hover:bg-muted/60"
                  )}
                >
                  {item.label}
                </Link>
              ))}
              {[
                { href: "/give", label: "Give" },
                { href: "/gallery", label: "Gallery" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-lg px-3 py-2.5 text-sm font-medium sm:hidden",
                    pathname === item.href ||
                      pathname.startsWith(`${item.href}/`)
                      ? "bg-primary/15 text-foreground"
                      : "text-muted-foreground hover:bg-muted/60"
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/visit"
                onClick={() => setOpen(false)}
                className="btn-gold mt-2 rounded-lg px-3 py-2.5 text-center text-sm font-bold"
              >
                Plan Your Visit
              </Link>
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="mt-1 rounded-lg px-3 py-2 text-center text-xs text-muted-foreground"
              >
                Leaders Login
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
