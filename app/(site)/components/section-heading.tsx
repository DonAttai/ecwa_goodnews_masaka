import { cn } from "@/lib/utils"
import Reveal from "./reveal"

/** Eyebrow + serif headline + optional lede, centered or left. */
export default function SectionHeading({
  eyebrow,
  title,
  lede,
  align = "center",
  dark = false,
  className,
}: {
  eyebrow: string
  title: React.ReactNode
  lede?: string
  align?: "center" | "left"
  dark?: boolean
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
          "text-xs font-semibold tracking-[0.28em] uppercase",
          dark ? "text-[#e8d5a3]" : "text-primary"
        )}
      >
        {eyebrow}
      </p>
      <h2
        className={cn(
          "font-display mt-3 text-3xl leading-[1.08] font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl",
          dark ? "text-white" : "text-foreground"
        )}
      >
        {title}
      </h2>
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
