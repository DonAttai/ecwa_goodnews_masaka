import { cn } from "@/lib/utils"
import Reveal from "./reveal"

/** Eyebrow + serif headline + optional lede, centered or left. */
export default function SectionHeading({
  eyebrow,
  title,
  lede,
  align = "center",
  dark = false,
  as: Tag = "h2",
  className,
}: {
  eyebrow: string
  title: React.ReactNode
  lede?: string
  align?: "center" | "left"
  dark?: boolean
  as?: "h2" | "h3"
  className?: string
}) {
  return (
    <Reveal
      className={cn(
        "max-w-3xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className
      )}
    >
      <p
        className={cn(
          "eyebrow",
          dark ? "text-[#e8d5a3]" : "text-gold-deep"
        )}
      >
        {eyebrow}
      </p>
      <Tag
        className={cn(
          "font-display mt-3 text-3xl leading-[1.08] font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl",
          dark ? "text-white" : "text-foreground"
        )}
      >
        {title}
      </Tag>
      {lede && (
        <p
          className={cn(
            "mt-4 text-base leading-7 sm:text-lg sm:leading-8",
            dark ? "text-white/70" : "text-muted-foreground"
          )}
        >
          {lede}
        </p>
      )}
    </Reveal>
  )
}
