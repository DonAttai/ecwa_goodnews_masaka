import { describe, expect, it } from "vitest"
import {
  normalizePersonName,
  rankChildMatch,
  rankSpouseCandidate,
  tokenizePersonName,
} from "./matching"

describe("tokenizePersonName", () => {
  it("strips honorifics, punctuation and case", () => {
    expect(tokenizePersonName("Mrs. Mary Doe")).toEqual(["mary", "doe"])
    expect(tokenizePersonName("PASTOR John  O'Brien")).toEqual([
      "john",
      "o",
      "brien",
    ])
  })

  it("returns no tokens for an empty or honorific-only name", () => {
    expect(tokenizePersonName("   ")).toEqual([])
    expect(tokenizePersonName("Mrs.")).toEqual([])
  })
})

describe("normalizePersonName", () => {
  it("ignores token order", () => {
    expect(normalizePersonName("Doe Mary")).toBe(
      normalizePersonName("Mary Doe")
    )
  })

  it("keeps different names different", () => {
    expect(normalizePersonName("Mary Doe")).not.toBe(
      normalizePersonName("Mary Johnson")
    )
  })
})

describe("rankSpouseCandidate", () => {
  const candidate = {
    firstName: "John",
    surname: "Doe",
    otherNames: null,
    presentAddress: "12 Masaka Road",
    homeCell: "Grace Cell",
    zone: "Masaka",
    gender: "MALE",
    children: [{ name: "Grace Doe" }, { name: "Samuel Doe" }],
  }

  it("ranks an exact name match highest", () => {
    const exact = rankSpouseCandidate(candidate, { name: "John Doe" })
    const different = rankSpouseCandidate(candidate, { name: "John Peter" })

    expect(exact.score).toBeGreaterThan(different.score)
    expect(exact.reasons).toContain("Exact name match")
  })

  it("uses household details and shared children as signals", () => {
    const result = rankSpouseCandidate(candidate, {
      name: "J. Doe",
      surname: "Doe",
      address: "12 Masaka Road",
      homeCell: "Grace Cell",
      zone: "Masaka",
      childNames: ["grace doe"],
    })

    expect(result.reasons).toContain("Same surname")
    expect(result.reasons).toContain("Same address")
    expect(result.reasons).toContain("Same home cell")
    expect(result.reasons).toContain("Same zone")
    expect(result.reasons).toContain("1 child match")
  })

  it("does not treat a different family as a match", () => {
    const result = rankSpouseCandidate(
      {
        ...candidate,
        firstName: "Peter",
        surname: "Okoye",
        presentAddress: "1 Abuja Road",
        homeCell: null,
        zone: null,
        children: [{ name: "Grace Okoye" }],
      },
      { name: "Mary Doe", surname: "Doe", address: "12 Masaka Road" }
    )

    expect(result.reasons).toEqual([])
  })
})

describe("rankChildMatch", () => {
  const member = {
    firstName: "John",
    surname: "Doe",
    presentAddress: "12 Masaka Road",
    homeCell: "Grace Cell",
    zone: "Masaka",
  }

  it("scores more matched children and household signals higher", () => {
    const one = rankChildMatch(["Grace Doe"], member, {})
    const two = rankChildMatch(["Grace Doe", "Samuel Doe"], member, {})
    const withAddress = rankChildMatch(["Grace Doe"], member, {
      address: "12 Masaka Road",
    })

    expect(two.score).toBeGreaterThan(one.score)
    expect(withAddress.score).toBeGreaterThan(one.score)
    expect(withAddress.reasons).toContain("Same address")
  })
})
