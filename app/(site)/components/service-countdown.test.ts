import { describe, it, expect } from "vitest"
import { nextServiceTimestamp } from "./service-countdown"

// Sunday 08:00 WAT == Sunday 07:00 UTC.
const SUN_07_UTC = Date.UTC(2026, 8, 13, 7, 0, 0) // 2026-09-13 is a Sunday

describe("nextServiceTimestamp (WAT, UTC+1)", () => {
  it("targets the coming Sunday 08:00 WAT from Saturday", () => {
    // Sat 2026-09-12 08:00 WAT == 07:00 UTC
    const now = Date.UTC(2026, 8, 12, 7, 0, 0)
    expect(nextServiceTimestamp(now)).toBe(SUN_07_UTC)
  })

  it("counts down ~1 minute just before Sunday 08:00 WAT", () => {
    const now = Date.UTC(2026, 8, 13, 6, 59, 0)
    expect(nextServiceTimestamp(now) - now).toBe(60_000)
  })

  it("rolls to the next Sunday once 08:00 WAT has passed", () => {
    const now = Date.UTC(2026, 8, 13, 7, 0, 0)
    expect(nextServiceTimestamp(now)).toBe(SUN_07_UTC + 7 * 86_400_000)
  })

  it("targets the coming Sunday from midweek", () => {
    // Wed 2026-09-09 12:00 UTC
    const now = Date.UTC(2026, 8, 9, 12, 0, 0)
    expect(nextServiceTimestamp(now)).toBe(SUN_07_UTC)
  })
})
