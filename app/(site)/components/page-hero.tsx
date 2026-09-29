import Image from "next/image"
import Link from "next/link"
import Reveal from "./reveal"

/** Dark photographic banner for inner pages. */
export default function PageHero({
  eyebrow,
  title,
  lede,
  image,
  breadcrumb,
  actions,
}: {
  eyebrow: string
  title: React.ReactNode
  lede?: string
  image: string
  breadcrumb?: { label: string; href?: string }[]
  actions?: React.ReactNode
}) {
  return (
    <section className="relative overflow-hidden bg-[#101828]">
      <Image
        src={image}
        alt=""
        aria-hidden
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#101828] via-[#101828]/60 to-[#101828]/30" />
      <div className="relative mx-auto max-w-7xl px-4 pt-20 pb-14 sm:px-6 sm:pt-28 sm:pb-20">
        <Reveal>
          {breadcrumb && breadcrumb.length > 0 && (
            <nav aria-label="Breadcrumb" className="mb-4 text-xs text-white/60">
              <ol className="flex flex-wrap items-center gap-1.5">
                {breadcrumb.map((c, i) => (
                  <li key={c.label} className="flex items-center gap-1.5">
                    {i > 0 && <span aria-hidden>/</span>}
                    {c.href ? (
                      <Link href={c.href} className="transition hover:text-white">
                        {c.label}
                      </Link>
                    ) : (
                      <span aria-current="page" className="text-[#e8d5a3]">{c.label}</span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          )}
          <p className="eyebrow text-[#e8d5a3]">
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
          {actions && <div className="mt-7 flex flex-col gap-3 sm:flex-row">{actions}</div>}
        </Reveal>
      </div>
    </section>
  )
}
