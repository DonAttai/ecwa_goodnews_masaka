import { CopyNumberButton } from "./copy-button"
import { getSiteSettings, SITE_IMAGES } from "@/lib/site"
import PageHero from "../components/page-hero"
import Reveal from "../components/reveal"

export const revalidate = 3600

export default async function GivePage() {
  const settings = await getSiteSettings()
  const hasDetails = Boolean(settings.bankName && settings.bankAccountNumber)

  return (
    <div>
      <PageHero
        eyebrow="Give"
        title={
          <>
            Generosity is <span className="text-gold">worship.</span>
          </>
        }
        lede="Your tithes and offerings fuel worship, welfare, missions, and the next generation."
        image={SITE_IMAGES.worship}
      />

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-14 sm:px-6 sm:py-16 lg:grid-cols-5">
        {/* Impact */}
        <Reveal className="lg:col-span-2">
          <div className="flex h-full flex-col justify-center rounded-[1.75rem] bg-[#141c2b] p-7 text-white sm:p-9">
            <p className="font-display text-2xl leading-snug font-semibold text-balance">
              &ldquo;Each of you should give what you have decided in your
              heart… for God loves a cheerful giver.&rdquo;
            </p>
            <p className="mt-3 text-sm tracking-[0.2em] text-[#e8d5a3] uppercase">
              2 Corinthians 9:7
            </p>
            <div className="mt-7 space-y-3 text-sm">
              {[
                "Tithes & Sunday offerings",
                "Building & project seeds",
                "Welfare, widows & missions",
              ].map((t) => (
                <p key={t} className="flex items-center gap-3 text-white/80">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#c9a84c]/20 text-xs text-[#e8d5a3]">
                    ✓
                  </span>
                  {t}
                </p>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Bank details */}
        <Reveal delay={120} className="lg:col-span-3">
          <div className="h-full rounded-[1.75rem] border border-border bg-card p-7 sm:p-9">
            <p className="text-xs font-bold tracking-[0.24em] text-primary uppercase">
              Bank transfer
            </p>
            <h2 className="font-display mt-2 text-2xl font-semibold sm:text-3xl">
              Give in two minutes
            </h2>
            <dl className="mt-6 space-y-4">
              {[
                {
                  k: "Bank",
                  v: settings.bankName ?? "To be announced by Finance",
                },
                {
                  k: "Account name",
                  v: settings.bankAccountName ?? settings.churchName,
                },
                {
                  k: "Account number",
                  v: settings.bankAccountNumber ?? "Ask Finance desk on Sunday",
                  copy: Boolean(settings.bankAccountNumber),
                },
              ].map((row) => (
                <div
                  key={row.k}
                  className="flex items-center justify-between gap-4 rounded-2xl bg-muted/40 px-5 py-4"
                >
                  <div>
                    <dt className="text-xs tracking-[0.18em] text-muted-foreground uppercase">
                      {row.k}
                    </dt>
                    <dd className="mt-1 text-lg font-bold tracking-tight">
                      {row.v}
                    </dd>
                  </div>
                  {row.copy && <CopyNumberButton value={String(row.v)} />}
                </div>
              ))}
            </dl>
            {!hasDetails && (
              <p className="mt-4 rounded-xl bg-primary/10 px-4 py-3 text-xs leading-5 text-muted-foreground">
                Final account details will be published here by the finance
                team.
              </p>
            )}
            <p className="mt-5 text-sm leading-6 text-muted-foreground">
              Use your name + purpose as narration (e.g.{" "}
              <em>&ldquo;John — Tithe&rdquo;</em>), then WhatsApp the receipt to{" "}
              {settings.financePhone ?? "the finance line"}.
            </p>
          </div>
        </Reveal>
      </div>
    </div>
  )
}
