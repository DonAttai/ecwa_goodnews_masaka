import Image from "next/image"
import { Images } from "lucide-react"
import { getGalleryImages, SITE_IMAGES } from "@/lib/site"
import PageHero from "../components/page-hero"
import { GalleryGrid } from "./gallery-grid"
import { EmptyState } from "@/components/ui/empty-state"

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
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Gallery" }]}
      />

      <div className="container-site py-14 sm:py-16">
        {photos.length === 0 ? (
          <EmptyState
            icon={Images}
            title="Photos coming soon"
            description="The media team will publish event photos here. Join us Sunday to make the album."
          />
        ) : (
          <GalleryGrid photos={photos} />
        )}
      </div>
    </div>
  )
}
