import Link from "next/link"
import Image from "next/image"
import { MapPin, ArrowRight } from "lucide-react"
import { getPublicEvents, SITE_IMAGES } from "@/lib/site"
import PageHero from "../components/page-hero"
import Reveal from "../components/reveal"

export const revalidate = 3600

function dateParts(iso: string) {
  const d = new Date(iso)
  return {
    day: d.toLocaleDateString(undefined, { day: "2-digit" }),
    mon: d.toLocaleDateString(undefined, { month: "short" }).toUpperCase(),
    full: d.toLocaleDateString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
    }),
  }
}

export default async function EventsPage() {
  const events = await getPublicEvents()

  return (
    <div>
      <PageHero
        eyebrow="Events"
        title={
          <>
            Gather. Grow. <span className="text-gold">Go.</span>
          </>
        }
        lede="Conferences, revivals, vigils, and celebrations — mark your calendar and invite someone."
        image={SITE_IMAGES.worship}
      />

      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
        {events.length === 0 ? (
          <div className="rounded-[2rem] border border-border bg-card p-10 text-center">
            <p className="font-display text-2xl font-semibold">
              Weekly services hold as usual
            </p>
            <p className="mt-2 text-muted-foreground">
              Sundays 8:00 AM • Tuesdays & Wednesdays 5:00 PM. Special programs
              will appear here.
            </p>
            <Link
              href="/visit"
              className="btn-gold mt-6 inline-block rounded-2xl px-7 py-3.5 font-bold"
            >
              Plan Your Visit
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((e, i) => {
              const p = dateParts(e.startsAt)
              return (
                <Reveal key={e.id} delay={Math.min(i, 4) * 70}>
                  <Link
                    href={`/events/${e.id}`}
                    className="group grid overflow-hidden rounded-[1.75rem] border border-border bg-card transition hover:border-primary/40 hover:shadow-xl sm:grid-cols-[auto_1fr_auto] sm:items-stretch"
                  >
                    {/* Date block */}
                    <div className="flex items-center gap-4 bg-[#141c2b] px-6 py-5 text-white sm:w-36 sm:flex-col sm:justify-center sm:gap-1 sm:text-center">
                      <span className="font-display text-4xl leading-none font-semibold text-[#e8d5a3] sm:text-5xl">
                        {p.day}
                      </span>
                      <span className="text-sm font-bold tracking-[0.24em] text-white/70">
                        {p.mon}
                      </span>
                    </div>
                    {/* Body */}
                    <div className="flex flex-1 gap-4 p-5 sm:p-6">
                      {e.flyerUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={e.flyerUrl}
                          alt=""
                          aria-hidden
                          className="hidden h-24 w-24 shrink-0 rounded-xl object-cover sm:block"
                          loading="lazy"
                        />
                      ) : (
                        <Image
                          src={SITE_IMAGES.huddle}
                          alt=""
                          aria-hidden
                          width={200}
                          height={200}
                          className="hidden h-24 w-24 shrink-0 rounded-xl object-cover sm:block"
                        />
                      )}
                      <div className="min-w-0">
                        <p className="font-display truncate text-xl font-semibold sm:text-2xl">
                          {e.title}
                        </p>
                        <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
                          {e.venue} • {p.full}
                        </p>
                        {e.description && (
                          <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                            {e.description}
                          </p>
                        )}
                      </div>
                    </div>
                    {/* Arrow */}
                    <div className="hidden items-center pr-6 sm:flex">
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/12 text-primary transition group-hover:bg-primary group-hover:text-[#141c2b]">
                        <ArrowRight className="h-5 w-5" />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
