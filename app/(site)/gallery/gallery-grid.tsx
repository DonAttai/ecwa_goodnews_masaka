"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import Reveal from "../components/reveal"

export type GalleryPhoto = { id: string; imageUrl: string; caption?: string }

export function GalleryGrid({ photos }: { photos: GalleryPhoto[] }) {
  const [index, setIndex] = useState<number | null>(null)
  const current = index !== null ? photos[index] : null

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {photos.map((p, i) => (
          <Reveal key={p.id} delay={(i % 3) * 70}>
            <button
              type="button"
              onClick={() => setIndex(i)}
              aria-label={p.caption ? `Open photo: ${p.caption}` : `Open photo ${i + 1}`}
              className="group relative block w-full overflow-hidden rounded-[1.25rem] border border-border text-left focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              <span className="relative block aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={p.imageUrl}
                  alt={p.caption ?? "Church photo"}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  loading="lazy"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </span>
              {p.caption && (
                <span className="absolute inset-x-0 bottom-0 block bg-gradient-to-t from-black/75 to-transparent px-4 pt-10 pb-3 text-sm font-semibold text-white">
                  {p.caption}
                </span>
              )}
            </button>
          </Reveal>
        ))}
      </div>

      <Dialog open={index !== null} onOpenChange={(o) => !o && setIndex(null)}>
        <DialogContent className="max-w-4xl overflow-hidden rounded-2xl border-white/10 bg-[#101828] p-0 text-white">
          <DialogTitle className="sr-only">{current?.caption ?? "Church photo"}</DialogTitle>
          {current && (
            <div className="relative">
              <span className="relative block aspect-video w-full">
                <Image src={current.imageUrl} alt={current.caption ?? "Church photo"} fill sizes="90vw" className="object-contain bg-black" />
              </span>
              {current.caption && <p className="px-5 py-4 text-sm text-white/80">{current.caption}</p>}
              <div className="absolute top-3 right-3 flex gap-2">
                <button aria-label="Close" onClick={() => setIndex(null)} className="rounded-full bg-black/60 p-2.5 transition hover:bg-black/80">
                  <X className="h-4 w-4" />
                </button>
              </div>
              {photos.length > 1 && (
                <>
                  <button
                    aria-label="Previous photo"
                    onClick={() => setIndex((v) => (v === null ? v : (v + photos.length - 1) % photos.length))}
                    className="absolute top-1/2 left-3 -translate-y-1/2 rounded-full bg-black/60 p-2.5 transition hover:bg-black/80"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    aria-label="Next photo"
                    onClick={() => setIndex((v) => (v === null ? v : (v + 1) % photos.length))}
                    className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full bg-black/60 p-2.5 transition hover:bg-black/80"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
