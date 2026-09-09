"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  createSermon,
  deleteSermon,
  createEvent,
  deleteEvent,
  createAnnouncement,
  deleteAnnouncement,
  createMinistry,
  deleteMinistry,
  updateGiveDetails,
  updateSiteIdentity,
  createGalleryImage,
  deleteGalleryImage,
  markMessageRead,
} from "../actions/website"

export type WebsiteData = {
  sermons: Array<{ id: string; title: string; preacher: string }>
  events: Array<{ id: string; title: string }>
  announcements: Array<{ id: string; title: string }>
  ministries: Array<{ id: string; name: string; leaderName: string | null }>
  gallery: Array<{ id: string; imageUrl: string; caption: string | null }>
  identity: {
    heroImageUrl: string | null
    heroVerse: string | null
    pastorName: string | null
    pastorPhotoUrl: string | null
    pastorMessage: string | null
    livestreamUrl: string | null
    facebookUrl: string | null
    instagramUrl: string | null
    youtubeUrl: string | null
  }
  give: {
    bankName: string | null
    bankAccountName: string | null
    bankAccountNumber: string | null
    financePhone: string | null
  }
  messages: Array<{
    id: string
    name: string
    phone: string
    subject: string
    message: string
    read: boolean
    createdAt: string
  }>
}

export default function WebsiteSection({ data }: { data: WebsiteData }) {
  const router = useRouter()
  const [tab, setTab] = useState<
    | "sermons"
    | "events"
    | "notices"
    | "ministries"
    | "gallery"
    | "giving"
    | "identity"
    | "inbox"
  >("sermons")

  async function wrap(
    fn: () => Promise<{ success: boolean; message: string }>
  ) {
    const res = await fn()
    if (res.success) {
      toast.success(res.message)
      router.refresh()
    } else toast.error(res.message)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {(
          [
            ["sermons", "Sermons"],
            ["events", "Events"],
            ["notices", "Announcements"],
            ["ministries", "Ministries"],
            ["gallery", "Gallery"],
            ["giving", "Giving"],
            ["identity", "Identity"],
            ["inbox", `Inbox (${data.messages.filter((m) => !m.read).length})`],
          ] as const
        ).map(([id, label]) => (
          <Button
            key={id}
            variant={tab === id ? "default" : "outline"}
            size="sm"
            onClick={() => setTab(id)}
          >
            {label}
          </Button>
        ))}
      </div>

      {tab === "sermons" && (
        <div className="space-y-4">
          <form
            action={(fd) => wrap(() => createSermon(fd))}
            className="grid gap-3 rounded-2xl border border-border bg-card/60 p-4"
          >
            <p className="font-semibold">Add sermon</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label>Title</Label>
                <Input name="title" required placeholder="Sermon title" />
              </div>
              <div className="space-y-1">
                <Label>Preacher</Label>
                <Input name="preacher" required placeholder="Preacher name" />
              </div>
              <div className="space-y-1">
                <Label>Date</Label>
                <Input name="sermonDate" type="date" required />
              </div>
              <div className="space-y-1">
                <Label>Passage (optional)</Label>
                <Input name="passage" placeholder="John 3:16" />
              </div>
            </div>
            <div className="space-y-1">
              <Label>YouTube URL (optional)</Label>
              <Input name="youtubeUrl" placeholder="https://youtube.com/..." />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="published" defaultChecked /> Published
              on website
            </label>
            <Button type="submit" className="btn-gold w-fit">
              Save sermon
            </Button>
          </form>
          <div className="space-y-2">
            {data.sermons.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card/60 px-4 py-3"
              >
                <p className="text-sm">
                  <span className="font-medium">{s.title}</span>{" "}
                  <span className="text-muted-foreground">• {s.preacher}</span>
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => wrap(() => deleteSermon(s.id))}
                >
                  Delete
                </Button>
              </div>
            ))}
            {data.sermons.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No sermons yet — the public page shows fallback content.
              </p>
            )}
          </div>
        </div>
      )}

      {tab === "events" && (
        <div className="space-y-4">
          <form
            action={(fd) => wrap(() => createEvent(fd))}
            className="grid gap-3 rounded-2xl border border-border bg-card/60 p-4"
          >
            <p className="font-semibold">Add event</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label>Title</Label>
                <Input name="title" required placeholder="Event title" />
              </div>
              <div className="space-y-1">
                <Label>Venue</Label>
                <Input name="venue" placeholder="Church Auditorium" />
              </div>
              <div className="space-y-1">
                <Label>Starts</Label>
                <Input name="startsAt" type="datetime-local" required />
              </div>
              <div className="space-y-1">
                <Label>Flyer URL (optional)</Label>
                <Input name="flyerUrl" placeholder="Cloudinary URL" />
              </div>
            </div>
            <div className="space-y-1">
              <Label>Description</Label>
              <Textarea name="description" rows={3} />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="published" defaultChecked /> Published
            </label>
            <Button type="submit" className="btn-gold w-fit">
              Save event
            </Button>
          </form>
          <div className="space-y-2">
            {data.events.map((e) => (
              <div
                key={e.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card/60 px-4 py-3"
              >
                <p className="text-sm font-medium">{e.title}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => wrap(() => deleteEvent(e.id))}
                >
                  Delete
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "notices" && (
        <div className="space-y-4">
          <form
            action={(fd) => wrap(() => createAnnouncement(fd))}
            className="grid gap-3 rounded-2xl border border-border bg-card/60 p-4"
          >
            <p className="font-semibold">Add announcement</p>
            <div className="space-y-1">
              <Label>Title</Label>
              <Input name="title" required />
            </div>
            <div className="space-y-1">
              <Label>Body</Label>
              <Textarea name="body" required rows={3} />
            </div>
            <div className="flex gap-4 text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" name="published" defaultChecked />{" "}
                Published
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" name="pinned" /> Pinned
              </label>
            </div>
            <Button type="submit" className="btn-gold w-fit">
              Save announcement
            </Button>
          </form>
          <div className="space-y-2">
            {data.announcements.map((a) => (
              <div
                key={a.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card/60 px-4 py-3"
              >
                <p className="text-sm font-medium">{a.title}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => wrap(() => deleteAnnouncement(a.id))}
                >
                  Delete
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "ministries" && (
        <div className="space-y-4">
          <form
            action={(fd) => wrap(() => createMinistry(fd))}
            className="grid gap-3 rounded-2xl border border-border bg-card/60 p-4"
          >
            <p className="font-semibold">Add ministry</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label>Name</Label>
                <Input name="name" required placeholder="Youth & Teens" />
              </div>
              <div className="space-y-1">
                <Label>Leader (optional)</Label>
                <Input name="leaderName" placeholder="Leader name" />
              </div>
            </div>
            <div className="space-y-1">
              <Label>Description</Label>
              <Textarea name="description" rows={3} />
            </div>
            <Button type="submit" className="btn-gold w-fit">
              Save ministry
            </Button>
          </form>
          <div className="space-y-2">
            {data.ministries.map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card/60 px-4 py-3"
              >
                <p className="text-sm">
                  <span className="font-medium">{m.name}</span>{" "}
                  {m.leaderName && (
                    <span className="text-muted-foreground">
                      • {m.leaderName}
                    </span>
                  )}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => wrap(() => deleteMinistry(m.id))}
                >
                  Delete
                </Button>
              </div>
            ))}
            {data.ministries.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No custom ministries yet — the public page shows the default
                list.
              </p>
            )}
          </div>
        </div>
      )}

      {tab === "gallery" && (
        <div className="space-y-4">
          <form
            action={(fd) => wrap(() => createGalleryImage(fd))}
            className="grid gap-3 rounded-2xl border border-border bg-card/60 p-4"
          >
            <p className="font-semibold">Add photo</p>
            <p className="text-sm text-muted-foreground">
              Upload the photo via Media (Cloudinary) or any image host, then
              paste the URL here.
            </p>
            <div className="space-y-1">
              <Label>Image URL</Label>
              <Input
                name="imageUrl"
                required
                placeholder="https://res.cloudinary.com/..."
              />
            </div>
            <div className="space-y-1">
              <Label>Caption (optional)</Label>
              <Input name="caption" placeholder="Sunday Service" />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="published" defaultChecked /> Published
            </label>
            <Button type="submit" className="btn-gold w-fit">
              Add photo
            </Button>
          </form>
          <div className="grid gap-3 sm:grid-cols-2">
            {data.gallery.map((g) => (
              <div
                key={g.id}
                className="overflow-hidden rounded-xl border border-border bg-card/60"
              >
                <img
                  src={g.imageUrl}
                  alt={g.caption ?? "Gallery photo"}
                  className="h-40 w-full object-cover"
                />
                <div className="flex items-center justify-between gap-2 px-3 py-2">
                  <p className="truncate text-sm text-muted-foreground">
                    {g.caption ?? "No caption"}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => wrap(() => deleteGalleryImage(g.id))}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
          {data.gallery.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No photos yet — the public gallery is hidden until you add one.
            </p>
          )}
        </div>
      )}

      {tab === "giving" && (
        <div className="space-y-4">
          <form
            action={(fd) => wrap(() => updateGiveDetails(fd))}
            className="grid gap-3 rounded-2xl border border-border bg-card/60 p-4"
          >
            <p className="font-semibold">Bank details shown on /give</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label>Bank name</Label>
                <Input
                  name="bankName"
                  defaultValue={data.give.bankName ?? ""}
                  placeholder="e.g. First Bank"
                />
              </div>
              <div className="space-y-1">
                <Label>Account name</Label>
                <Input
                  name="bankAccountName"
                  defaultValue={data.give.bankAccountName ?? ""}
                  placeholder="ECWA Goodnews 1, Masaka"
                />
              </div>
              <div className="space-y-1">
                <Label>Account number</Label>
                <Input
                  name="bankAccountNumber"
                  defaultValue={data.give.bankAccountNumber ?? ""}
                  placeholder="0123456789"
                />
              </div>
              <div className="space-y-1">
                <Label>Finance WhatsApp line (optional)</Label>
                <Input
                  name="financePhone"
                  defaultValue={data.give.financePhone ?? ""}
                  placeholder="080..."
                />
              </div>
            </div>
            <Button type="submit" className="btn-gold w-fit">
              Save giving details
            </Button>
          </form>
        </div>
      )}

      {tab === "identity" && (
        <div className="space-y-4">
          <form
            action={(fd) => wrap(() => updateSiteIdentity(fd))}
            className="grid gap-3 rounded-2xl border border-border bg-card/60 p-4"
          >
            <p className="font-semibold">Homepage hero</p>
            <div className="space-y-1">
              <Label>Hero image URL (blank = default photo)</Label>
              <Input
                name="heroImageUrl"
                defaultValue={data.identity.heroImageUrl ?? ""}
                placeholder="https://res.cloudinary.com/..."
              />
            </div>
            <div className="space-y-1">
              <Label>Hero verse / tagline</Label>
              <Input
                name="heroVerse"
                defaultValue={data.identity.heroVerse ?? ""}
                placeholder="Come to me, all who are weary — Matthew 11:28"
              />
            </div>
            <p className="pt-2 font-semibold">Pastor&apos;s welcome</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label>Pastor name</Label>
                <Input
                  name="pastorName"
                  defaultValue={data.identity.pastorName ?? ""}
                  placeholder="Rev. ..."
                />
              </div>
              <div className="space-y-1">
                <Label>Pastor photo URL</Label>
                <Input
                  name="pastorPhotoUrl"
                  defaultValue={data.identity.pastorPhotoUrl ?? ""}
                  placeholder="https://..."
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label>Welcome message</Label>
              <Textarea
                name="pastorMessage"
                defaultValue={data.identity.pastorMessage ?? ""}
                rows={3}
              />
            </div>
            <p className="pt-2 font-semibold">Livestream & socials</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label>Livestream URL</Label>
                <Input
                  name="livestreamUrl"
                  defaultValue={data.identity.livestreamUrl ?? ""}
                  placeholder="https://youtube.com/..."
                />
              </div>
              <div className="space-y-1">
                <Label>YouTube channel</Label>
                <Input
                  name="youtubeUrl"
                  defaultValue={data.identity.youtubeUrl ?? ""}
                  placeholder="https://youtube.com/@..."
                />
              </div>
              <div className="space-y-1">
                <Label>Facebook</Label>
                <Input
                  name="facebookUrl"
                  defaultValue={data.identity.facebookUrl ?? ""}
                  placeholder="https://facebook.com/..."
                />
              </div>
              <div className="space-y-1">
                <Label>Instagram</Label>
                <Input
                  name="instagramUrl"
                  defaultValue={data.identity.instagramUrl ?? ""}
                  placeholder="https://instagram.com/..."
                />
              </div>
            </div>
            <Button type="submit" className="btn-gold w-fit">
              Save identity
            </Button>
          </form>
        </div>
      )}

      {tab === "inbox" && (
        <div className="space-y-2">
          {data.messages.map((m) => (
            <div
              key={m.id}
              className="rounded-xl border border-border bg-card/60 px-4 py-3"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium">
                  {m.name} • {m.phone}{" "}
                  <span className="text-muted-foreground">• {m.subject}</span>
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    wrap(() => markMessageRead(m.id, !m.read))
                  }
                >
                  {m.read ? "Mark unread" : "Mark read"}
                </Button>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{m.message}</p>
            </div>
          ))}
          {data.messages.length === 0 && (
            <p className="text-sm text-muted-foreground">No messages yet.</p>
          )}
        </div>
      )}
    </div>
  )
}
