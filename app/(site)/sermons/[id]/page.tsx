import Link from "next/link"
import { ArrowLeft, CalendarDays, FileText, Volume2 } from "lucide-react"
import { notFound } from "next/navigation"
import { getPublicSermon, toYouTubeEmbed, SITE_IMAGES } from "@/lib/site"
import Reveal from "../../components/reveal"

export const revalidate = 3600

export default async function SermonDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const sermon = await getPublicSermon(id)
  if (!sermon) notFound()

  const embed = sermon.youtubeUrl ? toYouTubeEmbed(sermon.youtubeUrl) : null

  return (
    <div>
      {/* Dark title band */}
      <section className="bg-[#101828]">
        <div className="mx-auto max-w-4xl px-4 pt-14 pb-10 sm:px-6 sm:pt-20">
          <Reveal>
            <Link
              href="/sermons"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#e8d5a3] hover:underline"
            >
              <ArrowLeft className="h-4 w-4" /> All messages
            </Link>
            <p className="mt-4 text-xs font-bold tracking-[0.24em] text-[#c9a84c] uppercase">
              {new Date(sermon.sermonDate).toLocaleDateString(undefined, {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
            <h1 className="font-display mt-2 max-w-3xl text-3xl leading-[1.06] font-semibold tracking-tight text-balance text-white sm:text-5xl">
              {sermon.title}
            </h1>
            <p className="mt-3 text-white/70">
              {sermon.preacher}
              {sermon.passage ? ` • ${sermon.passage}` : ""}
            </p>
          </Reveal>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-12">
        <Reveal>
          {embed ? (
            <div className="overflow-hidden rounded-[1.75rem] border border-border shadow-xl">
              <iframe
                src={embed}
                title={sermon.title}
                className="aspect-video w-full"
                allowFullScreen
              />
            </div>
          ) : (
            <div
              className="flex aspect-video items-center justify-center rounded-[1.75rem] bg-cover bg-center"
              style={{ backgroundImage: `url(${SITE_IMAGES.bible})` }}
            >
              <div className="rounded-2xl bg-black/55 px-6 py-4 text-center backdrop-blur-sm">
                <p className="font-display text-xl font-semibold text-white">
                  {sermon.title}
                </p>
                <p className="mt-1 text-sm text-white/70">
                  Video coming soon — join us in person on Sunday.
                </p>
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            {sermon.audioUrl && (
              <a
                href={sermon.audioUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm font-bold hover:bg-muted/50"
              >
                <Volume2 className="h-4 w-4 text-primary" /> Listen to audio
              </a>
            )}
            {sermon.notesUrl && (
              <a
                href={sermon.notesUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm font-bold hover:bg-muted/50"
              >
                <FileText className="h-4 w-4 text-primary" /> Study notes
              </a>
            )}
            {sermon.youtubeUrl && (
              <a
                href={sermon.youtubeUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-gold rounded-xl px-5 py-3 text-sm font-bold"
              >
                Open on YouTube
              </a>
            )}
          </div>

          <div className="mt-10 flex items-center gap-3 rounded-2xl border border-border bg-muted/30 p-5">
            <CalendarDays className="h-5 w-5 shrink-0 text-primary" />
            <p className="text-sm text-muted-foreground">
              Missed this message? Sunday School holds 8:00 AM and Celebration
              Service 9:00 AM every Sunday.{" "}
              <Link href="/visit" className="font-bold text-primary hover:underline">
                Plan your visit
              </Link>
            </p>
          </div>
        </Reveal>
      </div>
    </div>
  )
}
