import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { getSiteSettings, SITE_IMAGES } from "@/lib/site"
import PageHero from "../components/page-hero"
import SectionHeading from "../components/section-heading"
import Reveal from "../components/reveal"

export const revalidate = 3600

const BELIEFS = [
  {
    t: "The Bible",
    d: "The inspired, infallible Word of God — our final authority in faith and conduct.",
  },
  {
    t: "One God, Three Persons",
    d: "Father, Son, and Holy Spirit — co-equal, co-eternal, one God.",
  },
  {
    t: "Jesus Christ",
    d: "Fully God and fully man; His death, resurrection, and return are our blessed hope.",
  },
  {
    t: "Salvation by grace",
    d: "Through repentance and faith in Jesus Christ alone — not by works.",
  },
  {
    t: "The Holy Spirit",
    d: "Who regenerates, empowers, and gifts believers for holy living and witness.",
  },
  {
    t: "The Church",
    d: "One body of Christ called to worship, fellowship, discipleship, and mission.",
  },
]

export default async function AboutPage() {
  const settings = await getSiteSettings()

  return (
    <div>
      <PageHero
        eyebrow="About us"
        title={
          <>
            Rooted in the Word,
            <br />
            <span className="text-gold">at home in Masaka.</span>
          </>
        }
        lede={`${settings.churchName} is a Bible-believing ECWA congregation — worshipping God, discipling believers, and serving our community.`}
        image={SITE_IMAGES.hero}
      />

      {/* Story */}
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-2 lg:gap-16">
        <Reveal className="relative order-2 lg:order-1">
          <div className="overflow-hidden rounded-[2rem]">
            <Image
              src={SITE_IMAGES.bible}
              alt="Studying God's Word"
              width={1200}
              height={900}
              className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
          <div className="absolute -bottom-6 -left-3 rounded-2xl bg-[#141c2b] px-6 py-5 text-white shadow-xl lg:-left-6">
            <p className="font-display text-3xl font-semibold text-[#e8d5a3]">
              ECWA
            </p>
            <p className="text-xs tracking-[0.2em] text-white/60 uppercase">
              Evangelical Church Winning All
            </p>
          </div>
        </Reveal>
        <div className="order-1 lg:order-2">
          <SectionHeading
            align="left"
            eyebrow="Our story"
            title="A family on mission"
          />
          <Reveal delay={100}>
            <div className="mt-5 space-y-4 leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              <p>
                {settings.welcomeMessage} From Sunday celebrations to midweek
                home cells, from Children&apos;s Church to community outreach —
                everything we do flows from one conviction: Jesus Christ
                changes everything.
              </p>
              <p>
                As part of the ECWA family, we hold fast to Scripture,
                passionate worship, and practical love — raising disciples who
                win their world for Christ.
              </p>
            </div>
            <Link
              href="/visit"
              className="btn-gold group mt-7 inline-flex items-center gap-2 rounded-2xl px-7 py-3.5 font-bold"
            >
              Come See For Yourself
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Beliefs */}
      <section className="border-y border-border bg-muted/40 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="What we believe"
            title="Anchored, unashamed, biblical"
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {BELIEFS.map((b, i) => (
              <Reveal key={b.t} delay={(i % 3) * 90}>
                <div className="h-full rounded-[1.5rem] border border-border bg-card p-6">
                  <p className="font-display text-xl font-semibold">
                    <span className="mr-2 text-primary">{String(i + 1).padStart(2, "0")}</span>
                    {b.t}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {b.d}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Mission pillars */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
        <SectionHeading eyebrow="Our mission" title="Winning all, together" />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            {
              img: SITE_IMAGES.worship,
              t: "Worship",
              d: "Passionate, Spirit-filled celebration that ushers hearts into God's presence.",
            },
            {
              img: SITE_IMAGES.huddle,
              t: "Fellowship",
              d: "Home cells and fellowships where nobody walks alone and everybody grows.",
            },
            {
              img: SITE_IMAGES.bible,
              t: "Witness",
              d: "Outreach, welfare, and missions that carry the Goodnews beyond our walls.",
            },
          ].map((p, i) => (
            <Reveal key={p.t} delay={i * 100}>
              <div className="group h-full overflow-hidden rounded-[1.75rem] border border-border bg-card transition hover:-translate-y-1 hover:shadow-xl">
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={p.img}
                    alt={p.t}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
                <div className="p-6">
                  <p className="font-display text-2xl font-semibold">{p.t}</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {p.d}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  )
}
