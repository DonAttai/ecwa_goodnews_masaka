"use server"

import { requireAdmin } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

function str(v: FormDataEntryValue | null | undefined) {
  return typeof v === "string" && v.trim() !== "" ? v.trim() : undefined
}

function checkbox(v: FormDataEntryValue | null | undefined) {
  return v === "on" || v === "true"
}

function date(v: FormDataEntryValue | null | undefined) {
  const s = str(v)
  if (!s) return undefined
  const d = new Date(s)
  return isNaN(d.getTime()) ? undefined : d
}

// ---- Sermons ----
export async function createSermon(formData: FormData) {
  try {
    await requireAdmin()
    const title = str(formData.get("title"))
    const preacher = str(formData.get("preacher"))
    const sermonDate = date(formData.get("sermonDate"))
    if (!title || !preacher || !sermonDate)
      return { success: false, message: "Title, preacher, and date required" }
    await prisma.sermon.create({
      data: {
        title,
        preacher,
        sermonDate,
        passage: str(formData.get("passage")),
        youtubeUrl: str(formData.get("youtubeUrl")),
        audioUrl: str(formData.get("audioUrl")),
        notesUrl: str(formData.get("notesUrl")),
        published: checkbox(formData.get("published")),
      },
    })
    revalidatePath("/sermons")
    revalidatePath("/")
    revalidatePath("/dashboard/settings")
    return { success: true, message: "Sermon saved" }
  } catch (e) {
    console.error(e)
    return { success: false, message: "Failed to save sermon" }
  }
}

export async function deleteSermon(id: string) {
  try {
    await requireAdmin()
    await prisma.sermon.delete({ where: { id } })
    revalidatePath("/sermons")
    revalidatePath("/")
    revalidatePath("/dashboard/settings")
    return { success: true, message: "Sermon deleted" }
  } catch (e) {
    console.error(e)
    return { success: false, message: "Delete failed" }
  }
}

// ---- Events ----
export async function createEvent(formData: FormData) {
  try {
    await requireAdmin()
    const title = str(formData.get("title"))
    const startsAt = date(formData.get("startsAt"))
    if (!title || !startsAt)
      return { success: false, message: "Title and start date required" }
    await prisma.event.create({
      data: {
        title,
        startsAt,
        endsAt: date(formData.get("endsAt")),
        description: str(formData.get("description")),
        venue: str(formData.get("venue")),
        flyerUrl: str(formData.get("flyerUrl")),
        published: checkbox(formData.get("published")),
      },
    })
    revalidatePath("/events")
    revalidatePath("/")
    revalidatePath("/dashboard/settings")
    return { success: true, message: "Event saved" }
  } catch (e) {
    console.error(e)
    return { success: false, message: "Failed to save event" }
  }
}

export async function deleteEvent(id: string) {
  try {
    await requireAdmin()
    await prisma.event.delete({ where: { id } })
    revalidatePath("/events")
    revalidatePath("/")
    revalidatePath("/dashboard/settings")
    return { success: true, message: "Event deleted" }
  } catch (e) {
    console.error(e)
    return { success: false, message: "Delete failed" }
  }
}

// ---- Announcements ----
export async function createAnnouncement(formData: FormData) {
  try {
    await requireAdmin()
    const title = str(formData.get("title"))
    const body = str(formData.get("body"))
    if (!title || !body)
      return { success: false, message: "Title and body required" }
    await prisma.announcement.create({
      data: {
        title,
        body,
        pinned: checkbox(formData.get("pinned")),
        published: checkbox(formData.get("published")),
        startsAt: date(formData.get("startsAt")),
        endsAt: date(formData.get("endsAt")),
      },
    })
    revalidatePath("/")
    revalidatePath("/dashboard/settings")
    return { success: true, message: "Announcement saved" }
  } catch (e) {
    console.error(e)
    return { success: false, message: "Failed to save announcement" }
  }
}

export async function deleteAnnouncement(id: string) {
  try {
    await requireAdmin()
    await prisma.announcement.delete({ where: { id } })
    revalidatePath("/")
    revalidatePath("/dashboard/settings")
    return { success: true, message: "Announcement deleted" }
  } catch (e) {
    console.error(e)
    return { success: false, message: "Delete failed" }
  }
}

// ---- Ministries ----
export async function createMinistry(formData: FormData) {
  try {
    await requireAdmin()
    const name = str(formData.get("name"))
    if (!name) return { success: false, message: "Ministry name required" }
    await prisma.ministry.create({
      data: {
        name,
        description: str(formData.get("description")),
        leaderName: str(formData.get("leaderName")),
        imageUrl: str(formData.get("imageUrl")),
      },
    })
    revalidatePath("/ministries")
    revalidatePath("/")
    revalidatePath("/dashboard/settings")
    return { success: true, message: "Ministry saved" }
  } catch (e) {
    console.error(e)
    return { success: false, message: "Failed to save ministry (name may exist)" }
  }
}

export async function deleteMinistry(id: string) {
  try {
    await requireAdmin()
    await prisma.ministry.delete({ where: { id } })
    revalidatePath("/ministries")
    revalidatePath("/")
    revalidatePath("/dashboard/settings")
    return { success: true, message: "Ministry deleted" }
  } catch (e) {
    console.error(e)
    return { success: false, message: "Delete failed" }
  }
}

// ---- Site identity (hero, pastor, livestream, socials) ----
export async function updateSiteIdentity(formData: FormData) {
  try {
    await requireAdmin()
    const data = {
      heroImageUrl: str(formData.get("heroImageUrl")) ?? null,
      heroVerse: str(formData.get("heroVerse")) ?? null,
      pastorName: str(formData.get("pastorName")) ?? null,
      pastorPhotoUrl: str(formData.get("pastorPhotoUrl")) ?? null,
      pastorMessage: str(formData.get("pastorMessage")) ?? null,
      livestreamUrl: str(formData.get("livestreamUrl")) ?? null,
      facebookUrl: str(formData.get("facebookUrl")) ?? null,
      instagramUrl: str(formData.get("instagramUrl")) ?? null,
      youtubeUrl: str(formData.get("youtubeUrl")) ?? null,
    }
    const existing = await prisma.settings.findUnique({ where: { id: 1 } })
    if (!existing) {
      return {
        success: false,
        message: "Set general church settings first (church name required)",
      }
    }
    await prisma.settings.update({ where: { id: 1 }, data })
    revalidatePath("/")
    revalidatePath("/about")
    revalidatePath("/dashboard/settings")
    return { success: true, message: "Site identity updated" }
  } catch (e) {
    console.error(e)
    return { success: false, message: "Failed to update site identity" }
  }
}

// ---- Giving details (stored on Settings singleton) ----
export async function updateGiveDetails(formData: FormData) {
  try {
    await requireAdmin()
    const data = {
      bankName: str(formData.get("bankName")) ?? null,
      bankAccountName: str(formData.get("bankAccountName")) ?? null,
      bankAccountNumber: str(formData.get("bankAccountNumber")) ?? null,
      financePhone: str(formData.get("financePhone")) ?? null,
    }
    const existing = await prisma.settings.findUnique({ where: { id: 1 } })
    if (!existing) {
      return {
        success: false,
        message: "Set general church settings first (church name required)",
      }
    }
    await prisma.settings.update({ where: { id: 1 }, data })
    revalidatePath("/give")
    revalidatePath("/dashboard/settings")
    return { success: true, message: "Giving details updated" }
  } catch (e) {
    console.error(e)
    return { success: false, message: "Failed to update giving details" }
  }
}

// ---- Gallery ----
export async function createGalleryImage(formData: FormData) {
  try {
    await requireAdmin()
    const imageUrl = str(formData.get("imageUrl"))
    if (!imageUrl) return { success: false, message: "Image URL required" }
    await prisma.galleryImage.create({
      data: {
        imageUrl,
        caption: str(formData.get("caption")),
        published: checkbox(formData.get("published")),
      },
    })
    revalidatePath("/gallery")
    revalidatePath("/dashboard/settings")
    return { success: true, message: "Photo added" }
  } catch (e) {
    console.error(e)
    return { success: false, message: "Failed to add photo" }
  }
}

export async function deleteGalleryImage(id: string) {
  try {
    await requireAdmin()
    await prisma.galleryImage.delete({ where: { id } })
    revalidatePath("/gallery")
    revalidatePath("/dashboard/settings")
    return { success: true, message: "Photo removed" }
  } catch (e) {
    console.error(e)
    return { success: false, message: "Delete failed" }
  }
}

// ---- Contact messages ----
export async function markMessageRead(id: string, read: boolean) {
  try {
    await requireAdmin()
    await prisma.contactMessage.update({ where: { id }, data: { read } })
    revalidatePath("/dashboard/settings")
    return { success: true, message: "Updated" }
  } catch (e) {
    console.error(e)
    return { success: false, message: "Update failed" }
  }
}
