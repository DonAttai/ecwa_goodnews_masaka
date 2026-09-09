import Link from "next/link"
import Image from "next/image"
import { Car, Baby, Clock, MapPin, HeartHandshake, ArrowRight } from "lucide-react"
import { getSiteSettings, SERVICE_TIMES, SITE_IMAGES } from "@/lib/site"
import PageHero from "../components/page-hero"
import SectionHeading from "../components/section-heading"
import Reveal from "../components/reveal"

export const revalidate = 3600

const FAQS = [
  {
    q: "What time should I arrive?",
    a: "Doors open 30 minutes before each service. Arrive 15–20 minutes early on your first visit so our ushers can welcome you, show you around, and settle your children into Children's Church.",
  },
  {
    q: "What should I wear?",
    a: "Come as you are. You'll see everything from traditional attire to smart casual — God looks at the heart, and so do we.",
  },
  {
    q: "Is there something for my children?",
    a: "Yes. Children's Church runs during the Sunday service with trained teachers in a safe, joyful environment. Teens join the Youth fellowship.",
  },
  {
    q: "How long is the service?",
    a: "Sunday School runs 8:00–8:50 AM, then Celebration Service 9:00–11:00 AM — vibrant praise, testimonies, an undiluted Word, and thanksgiving.",
  },
  {
    q: "I'm not an ECWA member. Can I still come?",
    a: "Absolutely. Everyone is welcome regardless of denomination or background. Membership classes run for those who decide to make Goodnews home.",
  },
]

export default async function VisitPage() {
  const settings = await getSiteSettings()

  return (
    <div>
      <PageHero
        eyebrow="Plan your visit"
        title={
          <>
            Your first Sunday,
            <br />
            <span className="text-gold">without the awkward.</span>
          </>
        }
        lede="Tell us you're coming — or just show up. Either way, a warm handshake and a saved seat are waiting."
        image={SITE_IMAGES.huddle}
      />

      {/* What to expect */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <SectionHeading
          eyebrow="What to expect"
            title="A Sunday that will mark your week"
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: Clock,
              t: "8:00 — Sunday School",
              d: "Interactive Bible classes for all ages — children, youth, and adults.",
            },
            {
              icon: Baby,
              t: "Children cared for",
              d: "Children's Church runs with trained teachers in a safe, joyful space.",
            },
            {
              icon: HeartHandshake,
              t: "9:00 — Praise & the Word",
              d: "Energetic thanksgiving, testimonies, and undiluted Bible teaching.",
            },
            {
              icon: Car,
              t: "11:00 — Fellowship",
              d: "Meet a home cell, greet the pastor, and stay for warm fellowship.",
            },
          ].map((s, i) => (
            <Reveal key={s.t} delay={(i % 4) * 90}>
              <div className="h-full rounded-[1.5rem] border border-border bg-card p-6">
                <span className="inline-flex rounded-2xl bg-primary/15 p-3 text-primary">
                  <s.icon className="h-6 w-6" />
                </span>
                <p className="mt-4 font-display text-lg font-semibold">{s.t}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {s.d}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Service times band */}
      <section className="site-grain bg-[#141c2b] py-14 text-white sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <p className="text-xs font-semibold tracking-[0.28em] text-[#e8d5a3] uppercase">
              Service times
            </p>
            <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              When we gather
            </h2>
            <div className="mt-6 space-y-3">
              {SERVICE_TIMES.map((s) => (
                <div
                  key={s.title}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-5 py-4"
                >
                  <div>
                    <p className="font-semibold">{s.title}</p>
                    <p className="text-sm text-white/60">{s.day}</p>
                  </div>
                  <p className="font-display text-lg text-[#e8d5a3]">{s.time}</p>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={140} className="relative">
            <div className="overflow-hidden rounded-[2rem]">
              <Image
                src={SITE_IMAGES.worship}
                alt="Worship gathering"
                width={1200}
                height={800}
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-5 left-5 flex items-center gap-2 rounded-2xl bg-[#c9a84c] px-5 py-3 text-sm font-bold text-[#141c2b] shadow-xl">
              <MapPin className="h-4 w-4" /> {settings.address}
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQs */}
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20">
        <SectionHeading eyebrow="Good to know" title="First-timer FAQs" />
        <div className="mt-10 space-y-3">
          {FAQS.map((f, i) => (
            <Reveal key={f.q} delay={i * 60}>
              <details
                className="group rounded-2xl border border-border bg-card px-5 py-4 open:bg-muted/30"
                {...(i === 0 ? { open: true } : {})}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">
                  {f.a}
                </p>
              </details>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-10 text-center">
          <p className="text-muted-foreground">
            Still have questions? We&apos;d love to hear from you.
          </p>
          <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="btn-gold inline-flex items-center justify-center gap-2 rounded-2xl px-8 py-4 font-bold"
            >
              Say Hello <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/about"
              className="rounded-2xl border border-border px-8 py-4 text-center font-semibold transition hover:bg-muted/50"
            >
              Learn About Us
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  )
}
