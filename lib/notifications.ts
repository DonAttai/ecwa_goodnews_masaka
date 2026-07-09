import { prisma } from "@/lib/prisma"
import type { NotificationType } from "@/generated/prisma/client"

interface CreateNotificationInput {
  userId: string
  title: string
  message: string
  type?: NotificationType
  link?: string | null
}

export async function createNotification({
  userId,
  title,
  message,
  type = "INFO",
  link = null,
}: CreateNotificationInput) {
  return prisma.notification.create({
    data: {
      userId,
      title,
      message,
      type,
      link,
    },
  })
}
