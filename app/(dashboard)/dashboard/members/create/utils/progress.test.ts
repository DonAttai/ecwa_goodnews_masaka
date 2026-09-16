import { describe, it, expect } from "vitest"
import {
  submittableProgress,
  countFilledSubmittable,
  getSubmittableFields,
  BASE_SUBMITTABLE_FIELDS,
} from "./progress"

const EMPTY: Record<string, unknown> = {
  surname: "",
  firstName: "",
  presentAddress: "",
  phoneNumber: "",
  maritalStatus: "SINGLE",
  gender: undefined,
  stateOfOrigin: "",
  lga: "",
  tribe: "",
  acceptedChrist: "NO",
  baptized: "NO",
  communicant: "NO",
  beenOnDiscipline: "NO",
  spouseName: "",
  baptismPlace: "",
  baptizedBy: "",
  disciplineReason: "",
}

const FULL_BASE: Record<string, unknown> = {
  ...EMPTY,
  surname: "Doe",
  firstName: "John",
  presentAddress: "1 Church St",
  phoneNumber: "08031234567",
  gender: "MALE",
  stateOfOrigin: "Nasarawa",
  lga: "Karu",
  tribe: "Mada",
}

describe("submittableProgress", () => {
  it("scores a pristine form at 0% (defaults never count)", () => {
    expect(submittableProgress({ ...EMPTY })).toBe(0)
    expect(countFilledSubmittable({ ...EMPTY })).toBe(0)
  })

  it("has 8 base obligations for a single, unbaptized member", () => {
    expect(getSubmittableFields({ ...EMPTY })).toHaveLength(
      BASE_SUBMITTABLE_FIELDS.length
    )
    expect(BASE_SUBMITTABLE_FIELDS).toHaveLength(8)
  })

  it("reaches exactly 100% when the base set is filled", () => {
    expect(submittableProgress({ ...FULL_BASE })).toBe(100)
  })

  it("grows the denominator when married (spouse becomes obligatory)", () => {
    const values = { ...FULL_BASE, maritalStatus: "MARRIED" }
    expect(getSubmittableFields(values)).toContain("spouseName")
    // 8 of 9 filled
    expect(submittableProgress(values)).toBe(89)
    expect(
      submittableProgress({ ...values, spouseName: "Jane Doe" })
    ).toBe(100)
  })

  it("adds baptism details when baptized", () => {
    const values = { ...FULL_BASE, baptized: "YES" }
    expect(getSubmittableFields(values)).toEqual(
      expect.arrayContaining(["baptismPlace", "baptizedBy"])
    )
    // 8 of 10 filled
    expect(submittableProgress(values)).toBe(80)
    expect(
      submittableProgress({
        ...values,
        baptismPlace: "River Jordan",
        baptizedBy: "Pastor Paul",
      })
    ).toBe(100)
  })

  it("adds discipline reason when on discipline", () => {
    const values = { ...FULL_BASE, beenOnDiscipline: "YES" }
    expect(getSubmittableFields(values)).toContain("disciplineReason")
    // 8 of 9 filled
    expect(submittableProgress(values)).toBe(89)
  })

  it("ignores optional extras (fellowship, signatures, suggestions)", () => {
    const values = {
      ...FULL_BASE,
      fellowshipGroupIds: [],
      suggestions: "",
      memberSignature: "",
    }
    expect(submittableProgress(values)).toBe(100)
  })
})
