import Image from "next/image"
import Link from "next/link"
import { ArrowRight, PlayCircle, CalendarDays, MapPin, HeartHandshake } from "lucide-react"
import {
  getSiteSettings,
  getPublicEvents,
  getPublicSermons,
  getPublishedAnnouncements,
  getMinistries,
  sermonThumbnail,
  SERVICE_TIMES,
  SITE_IMAGES,
  HERO_VERSES,
} from "@/lib/site"
import ServiceCountdown from "./components/service-countdown"
import VerseMarquee from "./components/verse-marquee"
import SectionHeading from "./components/section-heading"
import Reveal from "./components/reveal"

export const revalidate = 3600

const MINISTRY_COVERS = [
  SITE_IMAGES.fellowship,
  SITE_IMAGES.huddle,
  SITE_IMAGES.kids,
  SITE_IMAGES.worship,
  SITE_IMAGES.bible,
  SITE_IMAGES.kids,
  SITE_IMAGES.sunrise,
  SITE_IMAGES.hero,
]

export default async function SiteHomePage() {
  const [settings, sermons, events, announcements, ministries] =
    await Promise.all([
      getSiteSettings(),
      getPublicSermons(),
      getPublicEvents(),
      getPublishedAnnouncements(),
      getMinistries(),
    ])

  const latestSermon = sermons[0]
  const nextEvent = events[0]
  const latestThumb = sermonThumbnail(latestSermon?.youtubeUrl)

  return (
    <div>
      {/* ————— HERO ————— */}
      <section className="relative flex min-h-[92svh] items-end overflow-hidden bg-[#101828]">
        <Image
          src={settings.heroImageUrl ?? SITE_IMAGES.hero}
          alt="Worship at ECWA Goodnews"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#101828] via-[#101828]/55 to-[#101828]/25" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#101828]/70 via-transparent to-transparent" />

        <div className="relative mx-auto w-full max-w-7xl px-4 pt-28 pb-10 sm:px-6 sm:pb-14">
          <Reveal>
            <p className="inline-flex items-center gap-2 rounded-full border border-[#c9a84c]/40 bg-black/30 px-4 py-1.5 text-[11px] font-semibold tracking-[0.24em] text-[#e8d5a3] uppercase backdrop-blur-sm sm:text-xs">
              {settings.heroVerse ?? HERO_VERSES[0]}
            </p>
            <h1 className="font-display mt-5 max-w-4xl text-4xl leading-[1.04] font-semibold tracking-tight text-balance text-white sm:text-6xl lg:text-7xl">
              A place to belong,
              <br />
              <span className="text-gold">a faith to call home.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/80 sm:text-lg sm:leading-8">
              {settings.welcomeMessage}
            </p>
          </Reveal>

          <Reveal delay={150} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/visit"
              className="btn-gold group inline-flex items-center justify-center gap-2 rounded-2xl px-8 py-4 text-center font-bold"
            >
              Plan Your Visit
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href={settings.livestreamUrl ?? "/sermons"}
              {...(settings.livestreamUrl
                ? { target: "_blank", rel: "noreferrer" }
                : {})}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/25 bg-white/10 px-8 py-4 text-center font-semibold text-white backdrop-blur-md transition hover:bg-white/20"
            >
              <PlayCircle className="h-5 w-5" />
              {settings.livestreamUrl ? "Watch Live" : "Watch Latest Message"}
            </Link>
          </Reveal>

          <Reveal
            delay={250}
            className="mt-10 flex flex-col gap-5 border-t border-white/15 pt-6 lg:flex-row lg:items-center lg:justify-between"
          >
            <ServiceCountdown />
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/75">
              {SERVICE_TIMES.map((s) => (
                <span key={s.title} className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4 text-[#c9a84c]" />
                  {s.day} {s.time} — {s.title}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <VerseMarquee items={HERO_VERSES} />

      {/* ————— WELCOME / BELONG ————— */}
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-2 lg:gap-16">
        <Reveal className="relative">
          <div className="overflow-hidden rounded-[2rem]">
            <Image
              src={SITE_IMAGES.fellowship}
              alt="Fellowship at ECWA Goodnews"
              width={1200}
              height={900}
              className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
          <div className="absolute -right-3 -bottom-6 hidden w-56 overflow-hidden rounded-2xl border-4 border-background shadow-xl sm:block lg:-right-6">
            <Image
              src={SITE_IMAGES.kids}
              alt="Children's church"
              width={600}
              height={450}
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
          <div className="absolute -top-5 -left-3 rounded-2xl bg-[#141c2b] px-5 py-4 text-white shadow-xl lg:-left-6">
            <p className="font-display text-2xl font-semibold text-[#e8d5a3]">
              Since faith
            </p>
            <p className="text-xs tracking-[0.2em] text-white/60 uppercase">
              Rooted in Masaka
            </p>
          </div>
        </Reveal>

        <div>
          <SectionHeading
            align="left"
            eyebrow="Welcome home"
            title={
              <>
                Come as you are.
                <br />
                Leave full of faith.
              </>
            }
          />
          <Reveal delay={100}>
            <p className="mt-5 leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              Whether it&apos;s your first Sunday or your five-hundredth, there
              is a seat saved for you at {settings.churchName} — vibrant
              worship, an undiluted Word, and a family that notices when
              you&apos;re missing.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Warm ushers & a safe, joyful Children's Church",
                "Home cells across Masaka for midweek fellowship",
                "Prayer, welfare & visitation when life happens",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3 text-sm sm:text-base">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs text-primary">
                    ✓
                  </span>
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/visit"
                className="btn-gold rounded-2xl px-7 py-3.5 text-center font-bold"
              >
                Plan Your Visit
              </Link>
              <Link
                href="/about"
                className="rounded-2xl border border-border px-7 py-3.5 text-center font-semibold transition hover:bg-muted/50"
              >
                Our Story
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ————— SERMON + EVENT SPOTLIGHT (dark) ————— */}
      <section className="site-grain bg-[#141c2b] py-16 text-white sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            dark
            eyebrow="This week"
            title="Fresh word, next gathering"
          />
          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {/* Latest sermon */}
            <Reveal>
              <Link
                href={latestSermon ? `/sermons/${latestSermon.id}` : "/sermons"}
                className="group block overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5 transition hover:border-[#c9a84c]/50"
              >
                <div className="relative aspect-video overflow-hidden">
                  {latestThumb ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={latestThumb}
                      alt={latestSermon?.title ?? "Latest sermon"}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <Image
                      src={SITE_IMAGES.bible}
                      alt="Latest sermon"
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-[#c9a84c] px-4 py-2 text-xs font-bold text-[#141c2b]">
                    <PlayCircle className="h-4 w-4" /> Latest message
                  </span>
                </div>
                <div className="p-6">
                  <p className="font-display text-xl font-semibold text-balance sm:text-2xl">
                    {latestSermon?.title ?? "Messages from the pulpit"}
                  </p>
                  <p className="mt-2 text-sm text-white/60">
                    {latestSermon
                      ? `${latestSermon.preacher}${latestSermon.passage ? ` • ${latestSermon.passage}` : ""}`
                      : "Visit the sermon archive"}
                  </p>
                </div>
              </Link>
            </Reveal>

            {/* Next event */}
            <Reveal delay={120}>
              <Link
                href={nextEvent ? `/events/${nextEvent.id}` : "/events"}
                className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5 transition hover:border-[#c9a84c]/50 sm:flex-row"
              >
                <div className="relative min-h-52 flex-1 overflow-hidden sm:min-h-full">
                  {nextEvent?.flyerUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={nextEvent.flyerUrl}
                      alt={nextEvent.title}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <Image
                      src={SITE_IMAGES.worship}
                      alt="Upcoming event"
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent sm:bg-gradient-to-r" />
                </div>
                <div className="flex flex-1 flex-col justify-center p-6 sm:p-8">
                  <p className="inline-flex w-fit items-center gap-2 rounded-full border border-[#c9a84c]/40 px-3 py-1 text-[11px] font-bold tracking-[0.2em] text-[#e8d5a3] uppercase">
                    <CalendarDays className="h-3.5 w-3.5" /> Next gathering
                  </p>
                  <p className="font-display mt-3 text-xl font-semibold text-balance sm:text-2xl">
                    {nextEvent?.title ?? "Sunday Celebration Service"}
                  </p>
                  <p className="mt-2 text-sm text-white/60">
                    {nextEvent
                      ? `${nextEvent.venue} • ${new Date(nextEvent.startsAt).toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}`
                      : "Sundays • 8 AM"}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-[#e8d5a3]">
                    View details
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ————— MINISTRIES ————— */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
        <SectionHeading
          eyebrow="Ministries"
          title="Find your place to serve & belong"
          lede="From the choir loft to the children's class to the streets of Masaka — there's a family waiting for you."
        />
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {ministries.slice(0, 8).map((m, i) => (
            <Reveal key={m.id} delay={(i % 4) * 90}>
              <Link
                href="/ministries"
                className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-border bg-card transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl"
              >
                <div className="relative h-44 shrink-0 overflow-hidden">
                  <Image
                    src={MINISTRY_COVERS[i % MINISTRY_COVERS.length]}
                    alt={m.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                  <p className="absolute bottom-3 left-4 font-display text-lg font-semibold text-white">
                    {m.name}
                  </p>
                </div>
                <p className="flex-1 p-4 text-sm leading-6 text-muted-foreground">
                  {m.description}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ————— TESTIMONIES ————— */}
      <section className="border-y border-border bg-muted/40 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading eyebrow="Stories" title="Lives changed here" />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              {
                quote:
                  "I walked in a stranger and was family before the benediction. My children run to Children's Church every Sunday.",
                name: "A Sunday worshipper",
              },
              {
                quote:
                  "The home cell carried us through my father's burial — prayers, presence, provision. This church shows up.",
                name: "A home cell member",
              },
              {
                quote:
                  "The Word here is undiluted and practical. My business and my marriage both bear the fruit.",
                name: "A men's fellowship brother",
              },
            ].map((t, i) => (
              <Reveal key={t.name} delay={i * 100}>
                <figure className="flex h-full flex-col rounded-[1.5rem] border border-border bg-card p-6 sm:p-7">
                  <span className="font-display text-4xl text-primary">
                    &ldquo;
                  </span>
                  <blockquote className="mt-1 flex-1 leading-7 text-foreground/90">
                    {t.quote}
                  </blockquote>
                  <figcaption className="mt-5 text-sm font-semibold text-muted-foreground">
                    — {t.name}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ————— ANNOUNCEMENTS ————— */}
      {announcements.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
          <SectionHeading align="left" eyebrow="Notice board" title="Announcements" />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {announcements.map((a, i) => (
              <Reveal key={a.id} delay={(i % 3) * 90}>
                <div className="h-full rounded-[1.5rem] border border-border bg-card p-6">
                  <p className="font-semibold">
                    {a.pinned && <span className="mr-2 text-primary">✦</span>}
                    {a.title}
                  </p>
                  <p className="mt-2 text-sm leading-6 whitespace-pre-line text-muted-foreground">
                    {a.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ————— GIVE BAND ————— */}
      <section className="relative overflow-hidden bg-[#141c2b] py-16 text-white sm:py-24">
        <Image
          src={SITE_IMAGES.worship}
          alt=""
          aria-hidden
          fill
          className="object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#141c2b] via-[#141c2b]/85 to-[#141c2b]/60" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2">
          <Reveal>
            <p className="text-xs font-semibold tracking-[0.28em] text-[#e8d5a3] uppercase">
              Generosity
            </p>
            <h2 className="font-display mt-3 text-3xl leading-[1.08] font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl">
              Your giving builds what outlives Sunday.
            </h2>
            <p className="mt-4 max-w-xl leading-7 text-white/70 sm:text-lg sm:leading-8">
              Tithes, offerings, and outreaches — every seed supports worship,
              welfare, missions, and the next generation in Masaka.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/give"
                className="btn-gold inline-flex items-center justify-center gap-2 rounded-2xl px-8 py-4 font-bold"
              >
                <HeartHandshake className="h-5 w-5" />
                Give Today
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-2xl border border-white/25 px-8 py-4 font-semibold text-white transition hover:bg-white/10"
              >
                Talk to Finance
              </Link>
            </div>
          </Reveal>
          <Reveal delay={140}>
            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {[
                { n: "8+", l: "Fellowships & ministries" },
                { n: "3", l: "Weekly gatherings" },
                { n: "1", l: "Family in Christ" },
              ].map((s) => (
                <div
                  key={s.l}
                  className="rounded-2xl border border-white/12 bg-white/5 p-5 text-center backdrop-blur-sm"
                >
                  <p className="font-display text-3xl font-semibold text-[#e8d5a3]">
                    {s.n}
                  </p>
                  <p className="mt-1 text-xs tracking-wide text-white/60 uppercase">
                    {s.l}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ————— FINAL CTA ————— */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] bg-[#141c2b] px-6 py-12 text-center text-white sm:px-12 sm:py-16">
            <Image
              src={SITE_IMAGES.sunrise}
              alt=""
              aria-hidden
              fill
              className="object-cover opacity-25"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#141c2b]/60 to-[#141c2b]" />
            <div className="relative">
              <MapPin className="mx-auto h-8 w-8 text-[#c9a84c]" />
              <h2 className="font-display mx-auto mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl">
                Join us this Sunday. Come as you are.
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-white/70">
                {settings.address} • Celebration Service 8:00 AM. Your seat is
                saved — and so is a warm handshake at the door.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  href="/visit"
                  className="btn-gold rounded-2xl px-8 py-4 font-bold"
                >
                  Plan Your Visit
                </Link>
                <Link
                  href="/contact"
                  className="rounded-2xl border border-white/25 px-8 py-4 font-semibold text-white transition hover:bg-white/10"
                >
                  Request Prayer
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  )
}
