import type { MemberCreateInput, MemberUpdateInput } from "./schemas"

export type MemberPayloadInput =
  | MemberCreateInput
  | MemberUpdateInput
  | FormData

// Stored as the "YES"/"NO" string enum. These must be read from FormData
// explicitly; otherwise yesNoEnum() coerces the missing value to "NO".
export const YES_NO_FIELDS = [
  "acceptedChrist",
  "baptized",
  "communicant",
  "beenOnDiscipline",
] as const

const OPTIONAL_STRING_FIELDS = [
  "otherNames",
  "email",
  "previousPlaceOfWorship",
  "spouseName",
  "homeCell",
  "zone",
  "passportUrl",
  "baptismPlace",
  "baptizedBy",
  "disciplineReason",
  "disciplineDate",
  "disciplineReliefDate",
  "previousChurchPosition",
  "suggestions",
  "memberSignature",
  "memberSignedDate",
  "pastorSignature",
  "pastorSignedDate",
] as const

function parseJsonArray(value: FormDataEntryValue | null): unknown[] {
  if (!value) return []
  try {
    const parsed = JSON.parse(String(value))
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

/**
 * Normalizes either a typed payload or raw `FormData` into a plain object
 * suitable for schema validation. Centralizes all field extraction and the
 * previously duplicated (and fragile) manual `formData.get()` calls.
 */
export function resolveMemberPayload(
  input: MemberPayloadInput
): Record<string, unknown> {
  if (!(input instanceof FormData)) return input as Record<string, unknown>

  const formData = input
  const data: Record<string, unknown> = {}

  for (const key of [
    "surname",
    "firstName",
    "presentAddress",
    "phoneNumber",
    "maritalStatus",
    "gender",
    "stateOfOrigin",
    "lga",
    "tribe",
    ...YES_NO_FIELDS,
    ...OPTIONAL_STRING_FIELDS,
  ]) {
    const value = formData.get(key)
    if (value == null) continue
    // Empty passportUrl is meaningful: it clears an existing photo.
    if (value === "" && key !== "passportUrl") continue
    let normalized = String(value)
    if (key === "phoneNumber") {
      normalized = normalized.replace(/[\s\-()]/g, "")
      if (/^234[789][01]\d{8}$/.test(normalized)) {
        normalized = `+${normalized}`
      }
    }
    data[key] = normalized
  }

  const children = parseJsonArray(formData.get("children"))
  if (children.length > 0) data.children = children

  const fellowshipGroupIds = parseJsonArray(formData.get("fellowshipGroupIds"))
  if (fellowshipGroupIds.length > 0)
    data.fellowshipGroupIds = fellowshipGroupIds

  return data
}
