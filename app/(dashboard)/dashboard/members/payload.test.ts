import { describe, expect, it } from "vitest"
import { resolveMemberPayload } from "./payload"
import { memberFormSchema } from "./schemas"

function makeFormData(overrides: Record<string, string> = {}) {
  const formData = new FormData()
  const values: Record<string, string> = {
    surname: "Doe",
    firstName: "Jane",
    presentAddress: "12 Masaka Road",
    phoneNumber: "08031234567",
    maritalStatus: "SINGLE",
    gender: "FEMALE",
    stateOfOrigin: "Nasarawa",
    lga: "Karu",
    tribe: "Eggon",
    acceptedChrist: "YES",
    baptized: "YES",
    baptismPlace: "ECWA Goodnews 1 Masaka",
    baptizedBy: "Pastor Paul",
    communicant: "YES",
    beenOnDiscipline: "YES",
    disciplineReason: "Restored after counselling",
    ...overrides,
  }

  for (const [key, value] of Object.entries(values)) {
    formData.append(key, value)
  }

  return formData
}

describe("resolveMemberPayload", () => {
  it("reads the YES/NO spiritual fields out of FormData", () => {
    const payload = resolveMemberPayload(makeFormData())

    expect(payload.acceptedChrist).toBe("YES")
    expect(payload.baptized).toBe("YES")
    expect(payload.communicant).toBe("YES")
    expect(payload.beenOnDiscipline).toBe("YES")
  })

  it("preserves YES values through schema validation", () => {
    const parsed = memberFormSchema.safeParse(
      resolveMemberPayload(makeFormData())
    )

    expect(parsed.success).toBe(true)
    if (parsed.success) {
      expect(parsed.data.acceptedChrist).toBe("YES")
      expect(parsed.data.baptized).toBe("YES")
      expect(parsed.data.communicant).toBe("YES")
      expect(parsed.data.beenOnDiscipline).toBe("YES")
    }
  })

  it("preserves explicit NO values", () => {
    const parsed = memberFormSchema.safeParse(
      resolveMemberPayload(
        makeFormData({
          acceptedChrist: "NO",
          baptized: "NO",
          baptismPlace: "",
          baptizedBy: "",
          communicant: "NO",
          beenOnDiscipline: "NO",
          disciplineReason: "",
        })
      )
    )

    expect(parsed.success).toBe(true)
    if (parsed.success) {
      expect(parsed.data.acceptedChrist).toBe("NO")
      expect(parsed.data.baptized).toBe("NO")
      expect(parsed.data.communicant).toBe("NO")
      expect(parsed.data.beenOnDiscipline).toBe("NO")
    }
  })

  it("preserves a passport URL", () => {
    const url = "https://res.cloudinary.com/demo/image/upload/members/jane.jpg"
    const payload = resolveMemberPayload(makeFormData({ passportUrl: url }))

    expect(payload.passportUrl).toBe(url)
  })

  it("preserves an explicitly cleared passport URL", () => {
    const payload = resolveMemberPayload(makeFormData({ passportUrl: "" }))

    expect(payload.passportUrl).toBe("")
  })

  it("reads a linked spouse id", () => {
    const payload = resolveMemberPayload(makeFormData({ spouseId: "member_1" }))

    expect(payload.spouseId).toBe("member_1")
  })

  it("preserves an explicitly cleared spouse id", () => {
    const payload = resolveMemberPayload(makeFormData({ spouseId: "" }))

    expect(payload.spouseId).toBe("")
  })

  it("passes through an empty children list so rows can be removed", () => {
    const formData = makeFormData()
    formData.append("children", "[]")

    expect(resolveMemberPayload(formData).children).toEqual([])
  })
})
