/** Infinite scripture ribbon. Content is duplicated for a seamless loop. */
export default function VerseMarquee({
  items,
}: {
  items: string[]
}) {
  const row = [...items, ...items]
  return (
    <div className="overflow-hidden border-y border-[#c9a84c]/25 bg-[#141c2b] py-4">
      <div className="animate-marquee flex w-max items-center gap-10 pr-10">
        {row.map((v, i) => (
          <span key={i} className="flex items-center gap-10 whitespace-nowrap">
            <span className="font-display text-sm tracking-wide text-[#e8d5a3] italic sm:text-base">
              {v}
            </span>
            <span className="text-[#c9a84c]">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}
