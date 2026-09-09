import { getGalleryImages, SITE_IMAGES } from "@/lib/site"
import PageHero from "../components/page-hero"
import Reveal from "../components/reveal"

export const revalidate = 3600

export default async function GalleryPage() {
  const photos = await getGalleryImages()

  return (
    <div>
      <PageHero
        eyebrow="Gallery"
        title={
          <>
            Life at <span className="text-gold">Goodnews.</span>
          </>
        }
        lede="Worship, fellowship, outreach — moments from the family album."
        image={SITE_IMAGES.worship}
      />

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
        {photos.length === 0 ? (
          <div className="mx-auto max-w-2xl rounded-[2rem] border border-border bg-card p-10 text-center">
            <p className="text-4xl">📷</p>
            <p className="font-display mt-4 text-2xl font-semibold">
              Photos coming soon
            </p>
            <p className="mt-1 text-muted-foreground">
              The media team will publish event photos here.
            </p>
          </div>
        ) : (
          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
            {photos.map((p, i) => (
              <Reveal key={p.id} delay={(i % 3) * 70}>
                <figure className="group relative overflow-hidden rounded-[1.25rem] border border-border">
                  <img
                    src={p.imageUrl}
                    alt={p.caption ?? "Church photo"}
                    className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  {p.caption && (
                    <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-4 pt-10 pb-3 text-sm font-semibold text-white">
                      {p.caption}
                    </figcaption>
                  )}
                </figure>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
