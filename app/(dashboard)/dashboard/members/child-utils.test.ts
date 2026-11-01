import { describe, expect, it } from "vitest"
import {
  findChildNameOverlap,
  findInternalChildDuplicates,
  normalizeChildName,
  uniqueChildKeys,
} from "./child-utils"

describe("normalizeChildName", () => {
  it("ignores case and surrounding whitespace", () => {
    expect(normalizeChildName("  John Doe ")).toBe("john doe")
  })

  it("collapses internal whitespace", () => {
    expect(normalizeChildName("John   Doe")).toBe("john doe")
  })

  it("treats punctuation as a word break", () => {
    expect(normalizeChildName("John-Doe.")).toBe("john doe")
  })

  it("treats different spellings of the same name as equal", () => {
    expect(normalizeChildName("JOHN  DOE")).toBe(normalizeChildName("John Doe"))
  })

  it("keeps distinct names distinct", () => {
    expect(normalizeChildName("John Doe")).not.toBe(
      normalizeChildName("Jane Doe")
    )
  })
})

describe("findChildNameOverlap", () => {
  it("finds names shared by two records, ignoring case and punctuation", () => {
    const overlap = findChildNameOverlap(
      [{ name: "John-Doe" }, { name: "Jane Doe" }],
      [{ name: "john doe" }, { name: "Grace Doe" }]
    )

    expect(overlap).toEqual(["John-Doe"])
  })

  it("returns an empty list when there is no overlap", () => {
    expect(
      findChildNameOverlap([{ name: "John Doe" }], [{ name: "Jane Doe" }])
    ).toEqual([])
  })
})

describe("findInternalChildDuplicates", () => {
  it("finds repeated names within one submission", () => {
    expect(
      findInternalChildDuplicates([
        { name: "John Doe" },
        { name: "  john   doe " },
        { name: "Jane Doe" },
      ])
    ).toEqual(["  john   doe "])
  })

  it("ignores empty names", () => {
    expect(
      findInternalChildDuplicates([{ name: "" }, { name: "   " }])
    ).toEqual([])
  })
})

describe("uniqueChildKeys", () => {
  it("deduplicates and normalizes names", () => {
    expect(
      uniqueChildKeys(["John Doe", "  john  doe ", "Jane Doe", ""])
    ).toEqual(["john doe", "jane doe"])
  })
})
