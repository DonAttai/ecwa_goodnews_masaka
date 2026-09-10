import { describe, it, expect } from "vitest"
import { rateLimit } from "@/lib/rate-limit"

describe("rateLimit (in-memory, single-node)", () => {
  it("allows up to the limit then blocks", () => {
    const key = `test:${Date.now()}:${Math.random()}`
    expect(rateLimit({ key, limit: 2, windowMs: 60_000 }).ok).toBe(true)
    expect(rateLimit({ key, limit: 2, windowMs: 60_000 }).ok).toBe(true)
    const blocked = rateLimit({ key, limit: 2, windowMs: 60_000 })
    expect(blocked.ok).toBe(false)
    expect(blocked.retryAfterSec).toBeGreaterThan(0)
  })
})
