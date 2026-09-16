import { describe, it, expect } from "vitest"
import { memberFormSchema } from "./schemas"

const baseValid = {
  surname: "Doe",
  firstName: "John",
  presentAddress: "1 Church St",
  phoneNumber: "08031234567",
  maritalStatus: "SINGLE",
  gender: "MALE",
  stateOfOrigin: "Nasarawa",
  lga: "Karu",
  tribe: "Mada",
  children: [],
  fellowshipGroupIds: [],
  acceptedChrist: "YES",
  baptized: "NO",
  communicant: "YES",
  beenOnDiscipline: "NO",
}

describe("memberFormSchema phone validation", () => {
  it("rejects empty and junk numbers", () => {
    for (const bad of ["", "123", "0803", "0700-abc", "0812345"]) {
      const r = memberFormSchema.safeParse({ ...baseValid, phoneNumber: bad })
      expect(r.success, bad || "(empty)").toBe(false)
    }
  })

  it("accepts 0-prefixed and +234 numbers", () => {
    for (const good of ["08031234567", "07051234567", "+2348031234567"]) {
      const r = memberFormSchema.safeParse({
        ...baseValid,
        phoneNumber: good,
      })
      expect(r.success, good).toBe(true)
    }
  })

  it("requires spouse name when married", () => {
    const r = memberFormSchema.safeParse({
      ...baseValid,
      maritalStatus: "MARRIED",
      spouseName: "",
    })
    expect(r.success).toBe(false)
  })

  it("rejects empty child name", () => {
    const r = memberFormSchema.safeParse({
      ...baseValid,
      children: [{ name: "", contact: "" }],
    })
    expect(r.success).toBe(false)
  })
})
