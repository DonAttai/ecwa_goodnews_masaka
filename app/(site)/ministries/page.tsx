import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { getMinistries, SITE_IMAGES } from "@/lib/site"
import PageHero from "../components/page-hero"
import Reveal from "../components/reveal"

export const revalidate = 3600

const COVERS = [
  SITE_IMAGES.fellowship,
  SITE_IMAGES.huddle,
  SITE_IMAGES.kids,
  SITE_IMAGES.worship,
  SITE_IMAGES.bible,
  SITE_IMAGES.sunrise,
  SITE_IMAGES.hero,
]

export default async function MinistriesPage() {
  const ministries = await getMinistries()

  return (
    <div>
      <PageHero
        eyebrow="Ministries"
        title={
          <>
            Everybody fits. <span className="text-gold">Everybody serves.</span>
          </>
        }
        lede="Fellowships, departments, and home cells — find the family within the family."
        image={SITE_IMAGES.fellowship}
      />

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
        <div className="grid gap-5 sm:grid-cols-2">
          {ministries.map((m, i) => (
            <Reveal key={m.id} delay={(i % 2) * 90}>
              <div className="group grid h-full overflow-hidden rounded-[1.75rem] border border-border bg-card transition hover:border-primary/40 hover:shadow-xl sm:grid-cols-2">
                <div className="relative min-h-48 overflow-hidden sm:min-h-full">
                  <Image
                    src={m.imageUrl ?? COVERS[i % COVERS.length]}
                    alt={m.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="flex flex-col justify-center p-6 sm:p-7">
                  <p className="font-display text-xl font-semibold sm:text-2xl">
                    {m.name}
                  </p>
                  {m.leaderName && (
                    <p className="mt-1 text-[11px] font-bold tracking-[0.2em] text-primary uppercase">
                      Led by {m.leaderName}
                    </p>
                  )}
                  <p className="mt-2.5 text-sm leading-6 text-muted-foreground">
                    {m.description ||
                      "Serve, grow, and belong with this family."}
                  </p>
                  <Link
                    href="/contact"
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-primary"
                  >
                    Join this ministry <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12 text-center">
          <div className="rounded-[2rem] bg-[#141c2b] px-6 py-10 text-white sm:py-12">
            <p className="font-display text-2xl font-semibold text-balance sm:text-3xl">
              Not sure where you fit? Start with a home cell.
            </p>
            <p className="mx-auto mt-2 max-w-xl text-sm text-white/65 sm:text-base">
              Small midweek groups across Masaka for prayer, the Word, and real
              friendship.
            </p>
            <Link
              href="/contact"
              className="btn-gold mt-6 inline-block rounded-2xl px-7 py-3.5 font-bold"
            >
              Connect Me
            </Link>
          </div>
        </Reveal>
      </div>
    </div>
  )
}
