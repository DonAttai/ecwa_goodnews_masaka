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

  it("requires marital status (no longer nullable)", () => {
    for (const bad of [null, undefined, ""]) {
      const payload = { ...baseValid, maritalStatus: bad }
      const r = memberFormSchema.safeParse(payload)
      expect(r.success, String(bad)).toBe(false)
    }
  })

  it("accepts a submittable-set payload end to end", () => {
    const r = memberFormSchema.safeParse(baseValid)
    expect(r.success).toBe(true)
  })

  it("requires baptism details when baptized", () => {
    const r = memberFormSchema.safeParse({
      ...baseValid,
      baptized: "YES",
      baptismPlace: "",
      baptizedBy: "",
    })
    expect(r.success).toBe(false)
    const ok = memberFormSchema.safeParse({
      ...baseValid,
      baptized: "YES",
      baptismPlace: "River Jordan",
      baptizedBy: "Pastor Paul",
    })
    expect(ok.success).toBe(true)
  })
})
