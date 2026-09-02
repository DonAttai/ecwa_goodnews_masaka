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
 * Simple in-memory sliding-window rate limiter.
 *
 * NOTE: counters live in process memory, so this is per-server-instance.
 * It is sufficient for a single self-hosted node; for multi-instance
 * deployments replace this with a shared store (e.g. Redis/Upstash).
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
  if (xff) return xff.split(",")[0].trim()
  return h.get("x-real-ip") ?? "unknown"
}
