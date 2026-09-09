import Link from "next/link"
import Image from "next/image"
import { PlayCircle, ArrowRight } from "lucide-react"
import { getPublicSermons, sermonThumbnail, SITE_IMAGES } from "@/lib/site"
import PageHero from "../components/page-hero"
import Reveal from "../components/reveal"

export const revalidate = 3600

export default async function SermonsPage() {
  const sermons = await getPublicSermons()
  const [featured, ...rest] = sermons
  const featuredThumb = sermonThumbnail(featured?.youtubeUrl)

  return (
    <div>
      <PageHero
        eyebrow="Sermons"
        title={
          <>
            Words that <span className="text-gold">build faith.</span>
          </>
        }
        lede="Catch up on recent messages from the pulpit — watch, listen, and share."
        image={SITE_IMAGES.bible}
      />

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
        {/* Featured */}
        {featured && (
          <Reveal>
            <Link
              href={`/sermons/${featured.id}`}
              className="group grid overflow-hidden rounded-[2rem] border border-border bg-card transition hover:border-primary/40 hover:shadow-xl lg:grid-cols-2"
            >
              <div className="relative aspect-video overflow-hidden lg:aspect-auto lg:min-h-80">
                {featuredThumb ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={featuredThumb}
                    alt={featured.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <Image
                    src={SITE_IMAGES.bible}
                    alt={featured.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                )}
                <span className="absolute inset-0 flex items-center justify-center">
                  <PlayCircle className="h-16 w-16 text-white drop-shadow-xl transition-transform group-hover:scale-110" />
                </span>
              </div>
              <div className="flex flex-col justify-center p-6 sm:p-10">
                <p className="text-xs font-bold tracking-[0.24em] text-primary uppercase">
                  Latest message
                </p>
                <p className="font-display mt-3 text-2xl font-semibold text-balance sm:text-3xl">
                  {featured.title}
                </p>
                <p className="mt-2 text-muted-foreground">
                  {featured.preacher}
                  {featured.passage ? ` • ${featured.passage}` : ""} •{" "}
                  {new Date(featured.sermonDate).toLocaleDateString(undefined, {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 font-bold text-primary">
                  Watch now <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          </Reveal>
        )}

        {/* Archive grid */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((s, i) => {
            const thumb = sermonThumbnail(s.youtubeUrl)
            return (
              <Reveal key={s.id} delay={(i % 3) * 90}>
                <Link
                  href={`/sermons/${s.id}`}
                  className="group block h-full overflow-hidden rounded-[1.5rem] border border-border bg-card transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl"
                >
                  <div className="relative aspect-video overflow-hidden bg-muted">
                    {thumb ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={thumb}
                        alt={s.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <Image
                        src={SITE_IMAGES.bible}
                        alt={s.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    )}
                    <span className="absolute inset-0 flex items-center justify-center">
                      <PlayCircle className="h-12 w-12 text-white drop-shadow-lg transition-transform group-hover:scale-110" />
                    </span>
                  </div>
                  <div className="p-5">
                    <p className="font-display text-lg leading-snug font-semibold">
                      {s.title}
                    </p>
                    <p className="mt-1.5 text-sm text-muted-foreground">
                      {s.preacher}
                      {s.passage ? ` • ${s.passage}` : ""}
                    </p>
                    <p className="mt-1 text-xs tracking-wide text-muted-foreground/70 uppercase">
                      {new Date(s.sermonDate).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </Link>
              </Reveal>
            )
          })}
        </div>

        {sermons.length === 0 && (
          <p className="mt-8 text-center text-muted-foreground">
            Messages are being prepared — check back soon.
          </p>
        )}
      </div>
    </div>
  )
}
