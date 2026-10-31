import { describe, expect, it } from "vitest"
import { toMemberFormData } from "./serialize"

describe("toMemberFormData", () => {
  it("includes a passport URL", () => {
    const url = "https://res.cloudinary.com/demo/image/upload/members/jane.jpg"
    const formData = toMemberFormData({ passportUrl: url })

    expect(formData.get("passportUrl")).toBe(url)
  })

  it("includes an explicitly cleared passport URL", () => {
    const formData = toMemberFormData({ passportUrl: "" })

    expect(formData.get("passportUrl")).toBe("")
  })

  it("still omits other empty optional fields", () => {
    const formData = toMemberFormData({ email: "", spouseName: "" })

    expect(formData.has("email")).toBe(false)
    expect(formData.has("spouseName")).toBe(false)
  })
})
