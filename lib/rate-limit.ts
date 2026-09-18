import { headers } from "next/headers"

type RateLimitOptions = {
  key: string
  limit: number
  windowMs: number
}

type RateLimitResult = {
  ok: boolean
  retryAfterSec: number
}

/**
 * Simple in-memory sliding-window rate limiter ($0, no Redis).
 *
 * NOTE (kept per project decision): counters live in process memory, so this
 * is per-server-instance and resets on redeploy. On Vercel Hobby
 * (serverless/multi-instance) this is best-effort brute-force friction, not
 * a hard global cap. Keys always combine user/email+IP so one attacker
 * cannot exhaust another user's bucket. A Postgres-backed limiter was
 * deliberately deferred to avoid extra DB writes/cost.
 *
 * Standard budgets (1h windows):
 * - login: 10/hr per email+IP
 * - forgot/reset/set-password: 5/hr per email-or-token+IP
 * - cloudinary-sign: 30/hr per user+IP
 */

const buckets = new Map<string, number[]>()

function prune(bucket: number[], windowMs: number, now: number) {
  const cutoff = now - windowMs
  let i = 0
  while (i < bucket.length && bucket[i] <= cutoff) i++
  return bucket.slice(i)
}

export function rateLimit({ key, limit, windowMs }: RateLimitOptions): RateLimitResult {
  const now = Date.now()
  const bucket = prune(buckets.get(key) ?? [], windowMs, now)

  if (bucket.length >= limit) {
    buckets.set(key, bucket)
    const oldest = bucket[0] ?? now
    const retryAfterSec = Math.max(1, Math.ceil((oldest + windowMs - now) / 1000))
    return { ok: false, retryAfterSec }
  }

  bucket.push(now)
  buckets.set(key, bucket)
  return { ok: true, retryAfterSec: 0 }
}

/** Best-effort client IP from Next.js request headers (single IP first). */
export async function getClientIp(): Promise<string> {
  const h = await headers()
  const xff = h.get("x-forwarded-for")
  if (xff) {
    const first = xff.split(",")[0].trim()
    if (first) return first
  }
  const realIp = h.get("x-real-ip")?.trim()
  return realIp || "unknown"
}

/** Standard `Retry-After` header value for 429 responses. */
export function retryAfterHeaders(retryAfterSec: number): Record<string, string> {
  return { "Retry-After": String(Math.max(1, retryAfterSec)) }
}
