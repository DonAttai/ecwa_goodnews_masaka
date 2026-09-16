import { describe, it, expect } from "vitest"
import {
  requiredProgress,
  countFilledRequired,
  CORE_REQUIRED_FIELDS,
} from "./progress"

const DEFAULTS: Record<string, unknown> = {
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
}

describe("requiredProgress", () => {
  it("scores a pristine form at 0% (defaults must not count)", () => {
    expect(requiredProgress({ ...DEFAULTS }, {}, DEFAULTS)).toBe(0)
    expect(countFilledRequired({ ...DEFAULTS }, {}, DEFAULTS)).toBe(0)
  })

  it("counts untouched non-defaulted fields once filled", () => {
    const values = { ...DEFAULTS, surname: "Doe", gender: "MALE" }
    expect(countFilledRequired(values, {}, DEFAULTS)).toBe(2)
  })

  it("ignores untouched schema defaults", () => {
    const values = { ...DEFAULTS }
    expect(countFilledRequired(values, {}, DEFAULTS)).toBe(0)
  })

  it("counts explicitly confirmed defaults once dirty", () => {
    const values = { ...DEFAULTS }
    const dirty = { maritalStatus: true, acceptedChrist: true }
    expect(countFilledRequired(values, dirty, DEFAULTS)).toBe(2)
  })

  it("counts restored drafts that differ from defaults (reset = pristine)", () => {
    const values = { ...DEFAULTS, acceptedChrist: "YES", surname: "Doe" }
    expect(countFilledRequired(values, {}, DEFAULTS)).toBe(2)
  })

  it("reaches 100% when all required fields are user-provided", () => {
    const values: Record<string, unknown> = {}
    for (const key of CORE_REQUIRED_FIELDS) {
      values[key] = DEFAULTS[key] === "NO" ? "YES" : `x-${key}`
    }
    values.maritalStatus = "MARRIED"
    values.gender = "FEMALE"
    const dirty: Record<string, unknown> = {}
    for (const key of CORE_REQUIRED_FIELDS) dirty[key] = true
    expect(requiredProgress(values, dirty, DEFAULTS)).toBe(100)
  })
})
