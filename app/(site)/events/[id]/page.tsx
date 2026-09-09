import Link from "next/link"
import { ArrowLeft, MapPin, CalendarDays } from "lucide-react"
import { notFound } from "next/navigation"
import { getPublicEvent } from "@/lib/site"
import Reveal from "../../components/reveal"

export const revalidate = 3600

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const event = await getPublicEvent(id)
  if (!event) notFound()

  return (
    <div>
      <section className="bg-[#101828]">
        <div className="mx-auto max-w-4xl px-4 pt-14 pb-10 sm:px-6 sm:pt-20">
          <Reveal>
            <Link
              href="/events"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#e8d5a3] hover:underline"
            >
              <ArrowLeft className="h-4 w-4" /> All events
            </Link>
            <h1 className="font-display mt-4 max-w-3xl text-3xl leading-[1.06] font-semibold tracking-tight text-balance text-white sm:text-5xl">
              {event.title}
            </h1>
            <div className="mt-4 flex flex-wrap gap-2 text-sm">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-2 text-white/85">
                <CalendarDays className="h-4 w-4 text-[#c9a84c]" />
                {new Date(event.startsAt).toLocaleString(undefined, {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-2 text-white/85">
                <MapPin className="h-4 w-4 text-[#c9a84c]" />
                {event.venue}
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-12">
        <Reveal>
          {event.flyerUrl && (
            // Plain img: flyer may be any host, not just configured remotePatterns
            <img
              src={event.flyerUrl}
              alt={`${event.title} flyer`}
              className="w-full rounded-[1.75rem] border border-border object-cover shadow-xl"
            />
          )}
          {event.description && (
            <p className="mt-8 text-base leading-8 whitespace-pre-line sm:text-lg">
              {event.description}
            </p>
          )}
          <div className="relative mt-10 overflow-hidden rounded-[1.75rem] bg-[#141c2b] p-8 text-center text-white sm:p-10">
            <p className="font-display text-2xl font-semibold text-balance sm:text-3xl">
              Don&apos;t come alone — invite someone.
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm text-white/65">
              Forward this page to a friend, neighbour, or colleague. There is
              room for them too.
            </p>
            <Link
              href="/contact"
              className="btn-gold mt-6 inline-block rounded-2xl px-7 py-3.5 font-bold"
            >
              Ask a Question
            </Link>
          </div>
        </Reveal>
      </div>
    </div>
  )
}
