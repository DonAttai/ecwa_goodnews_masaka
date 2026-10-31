import { describe, expect, it } from "vitest"
import { normalizeChildName } from "./child-utils"

describe("normalizeChildName", () => {
  it("ignores case and surrounding whitespace", () => {
    expect(normalizeChildName("  John Doe ")).toBe("john doe")
  })

  it("collapses internal whitespace", () => {
    expect(normalizeChildName("John   Doe")).toBe("john doe")
  })

  it("ignores punctuation", () => {
    expect(normalizeChildName("John-Doe.")).toBe("johndoe")
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
