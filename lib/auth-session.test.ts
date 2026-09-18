import { describe, it, expect } from "vitest"
import { getSessionMaxAgeSec } from "@/lib/session-max-age"

describe("getSessionMaxAgeSec ($0 cookie/JWT alignment)", () => {
  it("keeps 7d default at 604800s", () => {
    expect(getSessionMaxAgeSec("7d")).toBe(604800)
  })

  it("parses h/m/s units", () => {
    expect(getSessionMaxAgeSec("12h")).toBe(43200)
    expect(getSessionMaxAgeSec("30m")).toBe(1800)
    expect(getSessionMaxAgeSec("60s")).toBe(60)
  })

  it("falls back to 7d on garbage", () => {
    expect(getSessionMaxAgeSec("forever")).toBe(604800)
  })
})
