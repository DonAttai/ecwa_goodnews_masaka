import { prisma } from "@/lib/prisma"

export type SiteSettings = {
  churchName: string
  address?: string
  phone?: string
  email?: string
  website?: string
  logoUrl?: string
  welcomeMessage?: string
  bankName?: string
  bankAccountName?: string
  bankAccountNumber?: string
  financePhone?: string
  heroImageUrl?: string
  heroVerse?: string
  pastorName?: string
  pastorPhotoUrl?: string
  pastorMessage?: string
  livestreamUrl?: string
  facebookUrl?: string
  instagramUrl?: string
  youtubeUrl?: string
}

const FALLBACK: SiteSettings = {
  churchName: "ECWA Goodnews 1, Masaka",
  address: "Masaka, Nasarawa State, Nigeria",
  phone: "+234 (0) 800 000 0000",
  email: "ecwagoodnews1masaka@protonmail.com",
  welcomeMessage:
    "Welcome home. Join us for worship, fellowship, and growth in Christ.",
}

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const s = await prisma.settings.findUnique({ where: { id: 1 } })
    if (!s) return FALLBACK
    return {
      churchName: s.churchName || FALLBACK.churchName,
      address: s.address ?? FALLBACK.address,
      phone: s.phone ?? FALLBACK.phone,
      email: s.email ?? FALLBACK.email,
      website: s.website ?? undefined,
      logoUrl: s.logoUrl ?? undefined,
      welcomeMessage: s.welcomeMessage ?? FALLBACK.welcomeMessage,
      bankName: s.bankName ?? undefined,
      bankAccountName: s.bankAccountName ?? undefined,
      bankAccountNumber: s.bankAccountNumber ?? undefined,
      financePhone: s.financePhone ?? undefined,
      heroImageUrl: s.heroImageUrl ?? undefined,
      heroVerse: s.heroVerse ?? undefined,
      pastorName: s.pastorName ?? undefined,
      pastorPhotoUrl: s.pastorPhotoUrl ?? undefined,
      pastorMessage: s.pastorMessage ?? undefined,
      livestreamUrl: s.livestreamUrl ?? undefined,
      facebookUrl: s.facebookUrl ?? undefined,
      instagramUrl: s.instagramUrl ?? undefined,
      youtubeUrl: s.youtubeUrl ?? undefined,
    }
  } catch {
    return FALLBACK
  }
}

export const SERVICE_TIMES = [
  { day: "Sunday", title: "Sunday School", time: "8:00 AM – 8:50 AM" },
  { day: "Sunday", title: "Celebration Service", time: "9:00 AM – 11:00 AM" },
  { day: "Tuesday", title: "Bible Study", time: "5:00 PM – 6:15 PM" },
  { day: "Wednesday", title: "Prayer Meeting", time: "5:00 PM – 6:00 PM" },
]

/** Curated stock imagery (local). Every slot is DB-overridable via Settings. */
export const SITE_IMAGES = {
  hero: "/images/site/hero.jpg",
  worship: "/images/site/worship.jpg",
  bible: "/images/site/bible.jpg",
  sunrise: "/images/site/sunrise.jpg",
  fellowship: "/images/site/fellowship.jpg",
  huddle: "/images/site/huddle.jpg",
  kids: "/images/site/kids.jpg",
} as const

export const HERO_VERSES = [
  "Come to me, all who are weary — Matthew 11:28",
  "Taste and see that the Lord is good — Psalm 34:8",
  "For where two or three gather in my name — Matthew 18:20",
  "A place to belong, a faith to call home",
]

/** Extract a YouTube video ID from watch/share/embed URLs. */
export function getYouTubeId(url: string): string | null {
  try {
    const u = new URL(url)
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.slice(1).split("/")[0]
      return id || null
    }
    if (u.hostname.includes("youtube.com")) {
      if (u.pathname === "/watch") return u.searchParams.get("v")
      const parts = u.pathname.split("/")
      if (parts[1] === "embed" || parts[1] === "live" || parts[1] === "shorts")
        return parts[2] || null
    }
    return null
  } catch {
    return null
  }
}

/** Free thumbnail for any sermon with a YouTube link. */
export function sermonThumbnail(youtubeUrl?: string): string | null {
  if (!youtubeUrl) return null
  const id = getYouTubeId(youtubeUrl)
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null
}

export const MINISTRIES = [
  {
    slug: "men",
    name: "Men's Fellowship",
    description:
      "Raising godly men who lead their families and serve the church with integrity.",
  },
  {
    slug: "women",
    name: "Women's Fellowship",
    description:
      "Empowering women for faith, family, and community impact through fellowship and service.",
  },
  {
    slug: "youth",
    name: "Youth & Teens",
    description:
      "Helping the next generation know Christ, discover purpose, and live boldly.",
  },
  {
    slug: "children",
    name: "Children's Church",
    description:
      "Safe, joyful classes where children learn God's Word at their level.",
  },
  {
    slug: "choir",
    name: "Choir & Worship",
    description: "Leading the congregation into heartfelt praise and worship.",
  },
  {
    slug: "ushering",
    name: "Ushering & Protocol",
    description:
      "First faces of welcome — order, warmth, and excellence in every service.",
  },
  {
    slug: "media",
    name: "Media & Technical",
    description: "Sound, projection, livestream, and photography for God's glory.",
  },
  {
    slug: "cells",
    name: "Home Cells",
    description:
      "Midweek small groups across Masaka for prayer, Word, and care.",
  },
]

export type PublicSermon = {
  id: string
  title: string
  preacher: string
  passage?: string
  sermonDate: string
  youtubeUrl?: string
  audioUrl?: string
  notesUrl?: string
}

export type PublicEvent = {
  id: string
  title: string
  description: string
  venue: string
  startsAt: string
  endsAt?: string
  flyerUrl?: string
}

export type PublicAnnouncement = {
  id: string
  title: string
  body: string
  pinned: boolean
}

export type PublicMinistry = {
  id: string
  name: string
  description: string
  leaderName?: string
  imageUrl?: string
}

export type PublicGalleryImage = {
  id: string
  imageUrl: string
  caption?: string
}

export async function getGalleryImages(): Promise<PublicGalleryImage[]> {
  try {
    const rows = await prisma.galleryImage.findMany({
      where: { published: true },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      take: 24,
    })
    return rows.map((r) => ({
      id: r.id,
      imageUrl: r.imageUrl,
      caption: r.caption ?? undefined,
    }))
  } catch {
    return []
  }
}

export async function getPublicSermons(): Promise<PublicSermon[]> {
  try {
    const rows = await prisma.sermon.findMany({
      where: { published: true },
      orderBy: { sermonDate: "desc" },
      take: 6,
    })
    return rows.map((r) => ({
      id: r.id,
      title: r.title,
      preacher: r.preacher,
      passage: r.passage ?? undefined,
      sermonDate: r.sermonDate.toISOString(),
      youtubeUrl: r.youtubeUrl ?? undefined,
      audioUrl: r.audioUrl ?? undefined,
      notesUrl: r.notesUrl ?? undefined,
    }))
  } catch {
    return [
      {
        id: "seed-1",
        title: "The Good News of Great Joy",
        preacher: "Rev. Pastor",
        passage: "Luke 2:10",
        sermonDate: new Date().toISOString(),
      },
      {
        id: "seed-2",
        title: "Walking in Fellowship",
        preacher: "Rev. Pastor",
        passage: "1 John 1:7",
        sermonDate: new Date().toISOString(),
      },
    ]
  }
}

export async function getPublicEvents(): Promise<PublicEvent[]> {
  try {
    const rows = await prisma.event.findMany({
      where: { published: true, startsAt: { gte: new Date() } },
      orderBy: { startsAt: "asc" },
      take: 6,
    })
    return rows.map((r) => ({
      id: r.id,
      title: r.title,
      description: r.description ?? "",
      venue: r.venue ?? "Church Auditorium",
      startsAt: r.startsAt.toISOString(),
      endsAt: r.endsAt?.toISOString() ?? undefined,
      flyerUrl: r.flyerUrl ?? undefined,
    }))
  } catch {
    return [
      {
        id: "seed-e1",
        title: "Sunday Celebration Service",
        description: "Join us for worship, Word, and fellowship.",
        venue: "Church Auditorium, Masaka",
        startsAt: new Date().toISOString(),
      },
    ]
  }
}

export async function getPublicSermon(id: string): Promise<PublicSermon | null> {
  try {
    const r = await prisma.sermon.findFirst({ where: { id, published: true } })
    if (!r) return null
    return {
      id: r.id,
      title: r.title,
      preacher: r.preacher,
      passage: r.passage ?? undefined,
      sermonDate: r.sermonDate.toISOString(),
      youtubeUrl: r.youtubeUrl ?? undefined,
      audioUrl: r.audioUrl ?? undefined,
      notesUrl: r.notesUrl ?? undefined,
    }
  } catch {
    return null
  }
}

export async function getPublicEvent(id: string): Promise<PublicEvent | null> {
  try {
    const r = await prisma.event.findFirst({ where: { id, published: true } })
    if (!r) return null
    return {
      id: r.id,
      title: r.title,
      description: r.description ?? "",
      venue: r.venue ?? "Church Auditorium",
      startsAt: r.startsAt.toISOString(),
      endsAt: r.endsAt?.toISOString() ?? undefined,
      flyerUrl: r.flyerUrl ?? undefined,
    }
  } catch {
    return null
  }
}

export async function getPublishedAnnouncements(): Promise<
  PublicAnnouncement[]
> {
  try {
    const now = new Date()
    const rows = await prisma.announcement.findMany({
      where: {
        published: true,
        OR: [{ startsAt: null }, { startsAt: { lte: now } }],
      },
      orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
      take: 5,
    })
    return rows
      .filter((r) => !r.endsAt || r.endsAt >= now)
      .map((r) => ({ id: r.id, title: r.title, body: r.body, pinned: r.pinned }))
  } catch {
    return []
  }
}

export async function getMinistries(): Promise<PublicMinistry[]> {
  try {
    const rows = await prisma.ministry.findMany({
      orderBy: [{ order: "asc" }, { name: "asc" }],
    })
    if (rows.length > 0)
      return rows.map((r) => ({
        id: r.id,
        name: r.name,
        description: r.description ?? "",
        leaderName: r.leaderName ?? undefined,
        imageUrl: r.imageUrl ?? undefined,
      }))
  } catch {
    // fall through to static list
  }
  return MINISTRIES.map((m) => ({
    id: m.slug,
    name: m.name,
    description: m.description,
  }))
}

/** Convert a YouTube watch/share URL to an embed URL, or null if unrecognized. */
export function toYouTubeEmbed(url: string): string | null {
  try {
    const u = new URL(url)
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.slice(1)
      return id ? `https://www.youtube.com/embed/${id}` : null
    }
    if (u.hostname.includes("youtube.com")) {
      if (u.pathname === "/watch") {
        const id = u.searchParams.get("v")
        return id ? `https://www.youtube.com/embed/${id}` : null
      }
      if (u.pathname.startsWith("/embed/") || u.pathname.startsWith("/live/")) {
        const id = u.pathname.split("/")[2]
        return id ? `https://www.youtube.com/embed/${id}` : null
      }
    }
    return null
  } catch {
    return null
  }
}
