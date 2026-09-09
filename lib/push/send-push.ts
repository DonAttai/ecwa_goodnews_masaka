import webpush from "web-push"
import { prisma } from "@/lib/prisma"

let configured = false

function ensureConfigured() {
  if (configured) return true
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
  const privateKey = process.env.VAPID_PRIVATE_KEY
  const subject =
    process.env.VAPID_SUBJECT ?? "mailto:ecwagoodnews1masaka@protonmail.com"
  if (!publicKey || !privateKey) {
    console.warn("Push disabled: VAPID keys not configured")
    return false
  }
  webpush.setVapidDetails(subject, publicKey, privateKey)
  configured = true
  return true
}

export interface PushPayload {
  title: string
  body: string
  url?: string
  tag?: string
}

/**
 * Fan out a push notification to all of a user's devices.
 * Best-effort: expired/uninstalled subscriptions (404/410) are pruned,
 * and failures never throw — push must not break the calling transaction.
 */
export async function sendPushToUser(
  userId: string,
  payload: PushPayload
): Promise<{ sent: number; pruned: number }> {
  if (!ensureConfigured()) return { sent: 0, pruned: 0 }

  const subs = await prisma.pushSubscription.findMany({ where: { userId } })
  if (subs.length === 0) return { sent: 0, pruned: 0 }

  const body = JSON.stringify({
    title: payload.title,
    body: payload.body,
    url: payload.url ?? "/dashboard",
    tag: payload.tag ?? `ecwa-${Date.now()}`,
    icon: "/icons/icon-192.png",
  })

  let sent = 0
  let pruned = 0

  await Promise.allSettled(
    subs.map(async (sub) => {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          body
        )
        sent += 1
      } catch (err: unknown) {
        const status =
          typeof err === "object" && err !== null && "statusCode" in err
            ? (err as { statusCode?: number }).statusCode
            : undefined
        if (status === 404 || status === 410) {
          await prisma.pushSubscription
            .delete({ where: { id: sub.id } })
            .catch(() => undefined)
          pruned += 1
        } else {
          console.warn("Push send failed:", status ?? err)
        }
      }
    })
  )

  return { sent, pruned }
}
