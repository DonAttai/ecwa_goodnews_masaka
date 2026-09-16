import { describe, it, expect, beforeEach } from "vitest"
import {
  saveDraft,
  loadDraft,
  clearDraft,
  MEMBER_DRAFT_KEY,
} from "./draft"

beforeEach(() => {
  window.localStorage.clear()
})

describe("member draft utils", () => {
  it("round-trips values, passportUrl and step", () => {
    saveDraft({
      values: { surname: "Doe", firstName: "John" },
      passportUrl: "https://example.com/p.jpg",
      currentStep: 2,
      savedAt: new Date().toISOString(),
    })
    const loaded = loadDraft()
    expect(loaded?.values).toMatchObject({ surname: "Doe" })
    expect(loaded?.passportUrl).toBe("https://example.com/p.jpg")
    expect(loaded?.currentStep).toBe(2)
  })

  it("returns null for corrupt JSON", () => {
    window.localStorage.setItem(MEMBER_DRAFT_KEY, "not-json{{{")
    expect(loadDraft()).toBeNull()
  })

  it("returns null for wrong shape", () => {
    window.localStorage.setItem(
      MEMBER_DRAFT_KEY,
      JSON.stringify({ foo: 1 })
    )
    expect(loadDraft()).toBeNull()
  })

  it("expires drafts older than TTL", () => {
    saveDraft({
      values: { surname: "Old" },
      passportUrl: null,
      currentStep: 1,
      savedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    })
    expect(loadDraft()).toBeNull()
    expect(window.localStorage.getItem(MEMBER_DRAFT_KEY)).toBeNull()
  })

  it("clearDraft removes the key", () => {
    saveDraft({
      values: { surname: "X" },
      passportUrl: null,
      currentStep: 0,
      savedAt: new Date().toISOString(),
    })
    clearDraft()
    expect(loadDraft()).toBeNull()
  })
})
