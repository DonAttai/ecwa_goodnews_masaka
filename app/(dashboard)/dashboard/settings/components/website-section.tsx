"use client"

import { useRouter } from "next/navigation"
import { useRef, useState, type RefObject } from "react"
import { useFormStatus } from "react-dom"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
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

// Submit button that disables itself while its parent <form>'s action is
// running. Must be a separate component rendered inside the form for
// useFormStatus to track the right form.
function SaveButton({
  label,
  pendingLabel = "Saving…",
}: {
  label: string
  pendingLabel?: string
}) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="btn-gold w-fit">
      {pending ? pendingLabel : label}
    </Button>
  )
}

type WebsiteTab =
  | "sermons"
  | "events"
  | "notices"
  | "ministries"
  | "gallery"
  | "giving"
  | "identity"
  | "inbox"

const ALL_TABS = [
  ["sermons", "Sermons"],
  ["events", "Events"],
  ["notices", "Announcements"],
  ["ministries", "Ministries"],
  ["gallery", "Gallery"],
  ["giving", "Giving"],
  ["identity", "Identity"],
] as const

export default function WebsiteSection({
  data,
  allowedTabs,
}: {
  data: WebsiteData
  // EDITOR role: subset of tabs. Ministries, giving, and inbox stay admin-only.
  allowedTabs?: readonly WebsiteTab[]
}) {
  const router = useRouter()
  const visibleTabs = ALL_TABS.filter(
    ([id]) => !allowedTabs || (allowedTabs as readonly string[]).includes(id)
  )
  const [tab, setTab] = useState<WebsiteTab>(
    allowedTabs && allowedTabs.length > 0 ? allowedTabs[0] : "sermons"
  )

  const [busyId, setBusyId] = useState<string | null>(null)
  const [pendingDelete, setPendingDelete] = useState<{
    kind: "sermon" | "event" | "announcement" | "ministry" | "photo"
    id: string
    label: string
  } | null>(null)
  const sermonFormRef = useRef<HTMLFormElement>(null)
  const eventFormRef = useRef<HTMLFormElement>(null)
  const noticeFormRef = useRef<HTMLFormElement>(null)
  const ministryFormRef = useRef<HTMLFormElement>(null)
  const galleryFormRef = useRef<HTMLFormElement>(null)

  async function wrap(
    fn: () => Promise<{ success: boolean; message: string }>,
    key?: string,
    resetRef?: RefObject<HTMLFormElement | null>
  ) {
    if (key) setBusyId(key)
    try {
      const res = await fn()
      if (res.success) {
        toast.success(res.message)
        resetRef?.current?.reset()
        router.refresh()
      } else toast.error(res.message)
    } finally {
      if (key) setBusyId(null)
    }
  }

  async function confirmDelete() {
    if (!pendingDelete) return
    const { kind, id } = pendingDelete
    const key = `del-${kind}-${id}`
    if (kind === "sermon") await wrap(() => deleteSermon(id), key)
    else if (kind === "event") await wrap(() => deleteEvent(id), key)
    else if (kind === "announcement")
      await wrap(() => deleteAnnouncement(id), key)
    else if (kind === "ministry") await wrap(() => deleteMinistry(id), key)
    else await wrap(() => deleteGalleryImage(id), key)
    setPendingDelete(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {visibleTabs.map(([id, label]) => (
          <Button
            key={id}
            variant={tab === id ? "default" : "outline"}
            size="sm"
            onClick={() => setTab(id)}
          >
            {label}
          </Button>
        ))}
        {(!allowedTabs || allowedTabs.includes("inbox")) && (
          <Button
            key="inbox"
            variant={tab === "inbox" ? "default" : "outline"}
            size="sm"
            onClick={() => setTab("inbox")}
          >
            {`Inbox (${data.messages.filter((m) => !m.read).length})`}
          </Button>
        )}
      </div>

      {tab === "sermons" && (
        <div className="space-y-4">
          <form
            ref={sermonFormRef}
            action={(fd) =>
              wrap(() => createSermon(fd), undefined, sermonFormRef)
            }
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
            <SaveButton label="Save sermon" pendingLabel="Saving sermon…" />
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
                  onClick={() =>
                    setPendingDelete({
                      kind: "sermon",
                      id: s.id,
                      label: `${s.title} • ${s.preacher}`,
                    })
                  }
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
            ref={eventFormRef}
            action={(fd) => wrap(() => createEvent(fd), undefined, eventFormRef)}
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
            <SaveButton label="Save event" pendingLabel="Saving event…" />
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
                  onClick={() =>
                    setPendingDelete({
                      kind: "event",
                      id: e.id,
                      label: e.title,
                    })
                  }
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
            ref={noticeFormRef}
            action={(fd) =>
              wrap(() => createAnnouncement(fd), undefined, noticeFormRef)
            }
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
            <SaveButton
              label="Save announcement"
              pendingLabel="Saving announcement…"
            />
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
                  onClick={() =>
                    setPendingDelete({
                      kind: "announcement",
                      id: a.id,
                      label: a.title,
                    })
                  }
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
            ref={ministryFormRef}
            action={(fd) =>
              wrap(() => createMinistry(fd), undefined, ministryFormRef)
            }
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
            <SaveButton
              label="Save ministry"
              pendingLabel="Saving ministry…"
            />
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
                  onClick={() =>
                    setPendingDelete({
                      kind: "ministry",
                      id: m.id,
                      label: m.name,
                    })
                  }
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
            ref={galleryFormRef}
            action={(fd) =>
              wrap(() => createGalleryImage(fd), undefined, galleryFormRef)
            }
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
            <SaveButton label="Add photo" pendingLabel="Adding photo…" />
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
                    onClick={() =>
                      setPendingDelete({
                        kind: "photo",
                        id: g.id,
                        label: g.caption ?? "Untitled photo",
                      })
                    }
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
            <SaveButton
              label="Save giving details"
              pendingLabel="Saving giving details…"
            />
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
            <SaveButton
              label="Save identity"
              pendingLabel="Saving identity…"
            />
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
                  disabled={busyId === `inbox-${m.id}`}
                  onClick={() =>
                    wrap(() => markMessageRead(m.id, !m.read), `inbox-${m.id}`)
                  }
                >
                  {busyId === `inbox-${m.id}`
                    ? "Saving…"
                    : m.read
                      ? "Mark unread"
                      : "Mark read"}
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

      {/* Shared delete confirmation — one dialog for all website items */}
      <AlertDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this item?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDelete && (
                <>
                  <span className="block font-medium text-foreground">
                    {pendingDelete.label}
                  </span>
                  This will remove it from the website immediately. This
                  action cannot be undone.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setPendingDelete(null)}
              disabled={
                !!pendingDelete &&
                busyId === `del-${pendingDelete.kind}-${pendingDelete.id}`
              }
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={
                !!pendingDelete &&
                busyId === `del-${pendingDelete.kind}-${pendingDelete.id}`
              }
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {pendingDelete &&
              busyId === `del-${pendingDelete.kind}-${pendingDelete.id}`
                ? "Deleting…"
                : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
