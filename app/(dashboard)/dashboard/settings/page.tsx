import { redirect } from "next/navigation"
import SettingsPage from "./components/settings-page"
import { prisma } from "@/lib/prisma"
import { GeneralType } from "./types/general"
import { getCurrentUser } from "@/app/actions/auth"
import type { Settings } from "@/generated/prisma/client"

async function getFellowships() {
  return prisma.fellowshipGroup.findMany({
    select: {
      id: true,
      name: true,
      description: true,
    },
    orderBy: { name: "asc" },
  })
}

async function getSettings() {
  return prisma.settings.findUnique({ where: { id: 1 } })
}

async function getDepartments() {
  return prisma.department.findMany({
    select: {
      id: true,
      name: true,
      description: true,
    },
    orderBy: { name: "asc" },
  })
}

async function getWebsiteContent() {
  const empty = {
    sermons: [],
    events: [],
    announcements: [],
    ministries: [],
    gallery: [],
    give: {
      bankName: null,
      bankAccountName: null,
      bankAccountNumber: null,
      financePhone: null,
    },
    identity: {
      heroImageUrl: null,
      heroVerse: null,
      pastorName: null,
      pastorPhotoUrl: null,
      pastorMessage: null,
      livestreamUrl: null,
      facebookUrl: null,
      instagramUrl: null,
      youtubeUrl: null,
    },
    messages: [],
  }
  try {
    const [sermons, events, announcements, ministries, gallery, settings, messages] =
      await Promise.all([
        prisma.sermon.findMany({
          orderBy: { sermonDate: "desc" },
          take: 20,
          select: { id: true, title: true, preacher: true },
        }),
        prisma.event.findMany({
          orderBy: { startsAt: "desc" },
          take: 20,
          select: { id: true, title: true },
        }),
        prisma.announcement.findMany({
          orderBy: { createdAt: "desc" },
          take: 20,
          select: { id: true, title: true },
        }),
        prisma.ministry.findMany({
          orderBy: [{ order: "asc" }, { name: "asc" }],
          take: 50,
          select: { id: true, name: true, leaderName: true },
        }),
        prisma.galleryImage.findMany({
          orderBy: { createdAt: "desc" },
          take: 30,
          select: { id: true, imageUrl: true, caption: true },
        }),
        prisma.settings.findUnique({
          where: { id: 1 },
          select: {
            bankName: true,
            bankAccountName: true,
            bankAccountNumber: true,
            financePhone: true,
            heroImageUrl: true,
            heroVerse: true,
            pastorName: true,
            pastorPhotoUrl: true,
            pastorMessage: true,
            livestreamUrl: true,
            facebookUrl: true,
            instagramUrl: true,
            youtubeUrl: true,
          },
        }),
        prisma.contactMessage.findMany({
          orderBy: { createdAt: "desc" },
          take: 30,
        }),
      ])
    return {
      sermons,
      events,
      announcements,
      ministries,
      gallery,
      give: {
        bankName: settings?.bankName ?? null,
        bankAccountName: settings?.bankAccountName ?? null,
        bankAccountNumber: settings?.bankAccountNumber ?? null,
        financePhone: settings?.financePhone ?? null,
      },
      identity: {
        heroImageUrl: settings?.heroImageUrl ?? null,
        heroVerse: settings?.heroVerse ?? null,
        pastorName: settings?.pastorName ?? null,
        pastorPhotoUrl: settings?.pastorPhotoUrl ?? null,
        pastorMessage: settings?.pastorMessage ?? null,
        livestreamUrl: settings?.livestreamUrl ?? null,
        facebookUrl: settings?.facebookUrl ?? null,
        instagramUrl: settings?.instagramUrl ?? null,
        youtubeUrl: settings?.youtubeUrl ?? null,
      },
      messages: messages.map((m) => ({ ...m, createdAt: m.createdAt.toISOString() })),
    }
  } catch {
    return empty
  }
}

const VALID_TABS = ["general", "website", "membership", "fellowships", "departments"] as const
type SettingsTab = (typeof VALID_TABS)[number]

// Scoped website data for the EDITOR role: sermons, events, announcements,
// gallery, and identity only. Ministries, giving/bank details, and the
// contact inbox stay admin-only and are never fetched here.
async function getEditorWebsiteContent() {
  const empty = {
    sermons: [],
    events: [],
    announcements: [],
    ministries: [],
    gallery: [],
    give: {
      bankName: null,
      bankAccountName: null,
      bankAccountNumber: null,
      financePhone: null,
    },
    identity: {
      heroImageUrl: null,
      heroVerse: null,
      pastorName: null,
      pastorPhotoUrl: null,
      pastorMessage: null,
      livestreamUrl: null,
      facebookUrl: null,
      instagramUrl: null,
      youtubeUrl: null,
    },
    messages: [],
  }
  try {
    const [sermons, events, announcements, gallery, settings] =
      await Promise.all([
        prisma.sermon.findMany({
          orderBy: { sermonDate: "desc" },
          take: 20,
          select: { id: true, title: true, preacher: true },
        }),
        prisma.event.findMany({
          orderBy: { startsAt: "desc" },
          take: 20,
          select: { id: true, title: true },
        }),
        prisma.announcement.findMany({
          orderBy: { createdAt: "desc" },
          take: 20,
          select: { id: true, title: true },
        }),
        prisma.galleryImage.findMany({
          orderBy: { createdAt: "desc" },
          take: 30,
          select: { id: true, imageUrl: true, caption: true },
        }),
        prisma.settings.findUnique({
          where: { id: 1 },
          select: {
            heroImageUrl: true,
            heroVerse: true,
            pastorName: true,
            pastorPhotoUrl: true,
            pastorMessage: true,
            livestreamUrl: true,
            facebookUrl: true,
            instagramUrl: true,
            youtubeUrl: true,
          },
        }),
      ])
    return {
      ...empty,
      sermons,
      events,
      announcements,
      gallery,
      identity: {
        heroImageUrl: settings?.heroImageUrl ?? null,
        heroVerse: settings?.heroVerse ?? null,
        pastorName: settings?.pastorName ?? null,
        pastorPhotoUrl: settings?.pastorPhotoUrl ?? null,
        pastorMessage: settings?.pastorMessage ?? null,
        livestreamUrl: settings?.livestreamUrl ?? null,
        facebookUrl: settings?.facebookUrl ?? null,
        instagramUrl: settings?.instagramUrl ?? null,
        youtubeUrl: settings?.youtubeUrl ?? null,
      },
    }
  } catch {
    return empty
  }
}

export default async function Settings({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>
}) {
  const user = await getCurrentUser()

  if (!user) redirect("/login")
  if (user.role !== "ADMIN" && user.role !== "EDITOR") redirect("/dashboard")

  const isEditor = user.role === "EDITOR"

  const params = await searchParams
  const initialTab: SettingsTab = isEditor
    ? "website"
    : VALID_TABS.includes(params.tab as SettingsTab)
      ? (params.tab as SettingsTab)
      : "general"

  // Editors never receive admin-only data: no ministries management, no
  // giving/bank details, no contact inbox. The website subset they get is
  // limited to sermons/events/announcements/gallery/identity.
  const [fellowships, settings, departments, website] = isEditor
    ? [[], null, [], await getEditorWebsiteContent()]
    : await Promise.all([
        getFellowships(),
        getSettings(),
        getDepartments(),
        getWebsiteContent(),
      ])

  const formattedFellowships = fellowships.map(
    (fellowship: { id: string; name: string; description: string | null }) => ({
      id: fellowship.id,
      name: fellowship.name,
      description: fellowship.description ?? undefined,
    })
  )

  const formattedDepartments = departments.map(
    (department: { id: string; name: string; description: string | null }) => ({
      id: department.id,
      name: department.name,
      description: department.description ?? undefined,
    })
  )

  const formatSettings = (settings: Settings | null): GeneralType => {
    if (!settings) {
      return {
        churchName: "",
      }
    }

    return {
      id: settings.id,
      churchName: settings.churchName,
      address: settings.address ?? undefined,
      phone: settings.phone ?? undefined,
      email: settings.email ?? undefined,
      website: settings.website ?? undefined,
      logoUrl: settings.logoUrl ?? undefined,
      welcomeMessage: settings.welcomeMessage ?? undefined,
    }
  }

  return (
    <SettingsPage
      fellowships={formattedFellowships}
      departments={formattedDepartments}
      generalSettings={formatSettings(settings)}
      website={website}
      initialTab={initialTab}
      editorMode={isEditor}
    />
  )
}
