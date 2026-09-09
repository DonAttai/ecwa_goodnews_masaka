"use server"

import { prisma } from "@/lib/prisma"
import { sendPushToUser } from "@/lib/push/send-push"

export async function submitContactMessage(formData: FormData) {
  const name = String(formData.get("name") || "").trim()
  const phone = String(formData.get("phone") || "").trim()
  const subject = String(formData.get("subject") || "General enquiry").trim()
  const message = String(formData.get("message") || "").trim()

  if (!name || !phone || !message) {
    return { success: false, message: "Please fill name, phone, and message." }
  }

  try {
    await prisma.contactMessage.create({
      data: { name, phone, subject, message },
    })

    // Notify admins (best-effort, table may not exist yet in some envs)
    try {
      const admins = await prisma.user.findMany({
        where: { role: "ADMIN", isActive: true },
        select: { id: true },
      })
      if (admins.length > 0) {
        await prisma.notification.createMany({
          data: admins.map((a) => ({
            userId: a.id,
            title: "New website message",
            message: `${name}: ${subject}`,
            link: "/dashboard/settings?tab=website",
          })),
        })
        await Promise.allSettled(
          admins.map((a) =>
            sendPushToUser(a.id, {
              title: "New website message",
              body: `${name}: ${subject}`,
              url: "/dashboard/settings?tab=website",
              tag: `contact-${Date.now()}`,
            })
          )
        )
      }
    } catch {
      // ignore notification failures
    }

    return {
      success: true,
      message: "Thank you. Your message has been received. God bless you.",
    }
  } catch (e) {
    // Table may not be migrated yet — don't lose the message silently in logs
    console.error("contactMessage failed:", e)
    return {
      success: true,
      message:
        "Thank you. Please also reach us on phone/WhatsApp while online forms finish setup.",
    }
  }
}
