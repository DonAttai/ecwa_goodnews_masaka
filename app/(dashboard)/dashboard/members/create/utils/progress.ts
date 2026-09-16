export const CORE_REQUIRED_FIELDS = [
  "surname",
  "firstName",
  "presentAddress",
  "phoneNumber",
  "maritalStatus",
  "gender",
  "stateOfOrigin",
  "lga",
  "tribe",
  "acceptedChrist",
  "baptized",
  "communicant",
  "beenOnDiscipline",
] as const

export type CoreRequiredField = (typeof CORE_REQUIRED_FIELDS)[number]

function isNonEmpty(value: unknown): boolean {
  return value != null && String(value).trim() !== ""
}

/**
 * Counts required fields the user actually provided.
 *
 * Schema defaults (e.g. maritalStatus "SINGLE", YES/NO radio groups) must NOT
 * count until the user touches them — otherwise a pristine form reads 38%.
 * A field counts when it is non-empty AND (dirty OR different from default),
 * so restored drafts (reset = pristine) still score correctly.
 */
export function countFilledRequired(
  values: Record<string, unknown>,
  dirtyFields: Partial<Record<string, unknown>> | undefined,
  defaultValues: Record<string, unknown>
): number {
  return CORE_REQUIRED_FIELDS.filter((key) => {
    const value = values[key]
    if (!isNonEmpty(value)) return false
    if (dirtyFields?.[key]) return true
    const defaultValue = defaultValues[key]
    if (defaultValue == null || defaultValue === "") return true
    return String(value) !== String(defaultValue)
  }).length
}

export function requiredProgress(
  values: Record<string, unknown>,
  dirtyFields: Partial<Record<string, unknown>> | undefined,
  defaultValues: Record<string, unknown>
): number {
  return Math.round(
    (countFilledRequired(values, dirtyFields, defaultValues) /
      CORE_REQUIRED_FIELDS.length) *
      100
  )
}
