import Image from "next/image"
import Reveal from "./reveal"

/** Dark photographic banner for inner pages. */
export default function PageHero({
  eyebrow,
  title,
  lede,
  image,
}: {
  eyebrow: string
  title: React.ReactNode
  lede?: string
  image: string
}) {
  return (
    <section className="relative overflow-hidden bg-[#101828]">
      <Image
        src={image}
        alt=""
        aria-hidden
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#101828] via-[#101828]/60 to-[#101828]/30" />
      <div className="relative mx-auto max-w-7xl px-4 pt-20 pb-14 sm:px-6 sm:pt-28 sm:pb-20">
        <Reveal>
          <p className="text-xs font-semibold tracking-[0.28em] text-[#e8d5a3] uppercase">
            {eyebrow}
          </p>
          <h1 className="font-display mt-3 max-w-3xl text-4xl leading-[1.05] font-semibold tracking-tight text-balance text-white sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          {lede && (
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/75 sm:text-lg sm:leading-8">
              {lede}
            </p>
          )}
        </Reveal>
      </div>
    </section>
  )
}
