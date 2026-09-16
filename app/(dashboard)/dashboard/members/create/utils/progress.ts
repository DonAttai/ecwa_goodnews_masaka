/**
 * The "submittable set": fields that actually block submit.
 *
 * Fellowship groups, children, suggestions and declaration signatures are
 * intentionally excluded (product decision: optional). YES/NO groups and
 * maritalStatus are excluded too — the schema coerces/defaults them so they
 * can never block. Progress and submit now share this single definition, so
 * submit is possible ⟺ progress reads 100%.
 */
export const BASE_SUBMITTABLE_FIELDS = [
  "surname",
  "firstName",
  "presentAddress",
  "phoneNumber",
  "gender",
  "stateOfOrigin",
  "lga",
  "tribe",
] as const

export type SubmittableField = string

function isNonEmpty(value: unknown): boolean {
  return value != null && String(value).trim() !== ""
}

/** Base fields plus whatever the member's answers make obligatory. */
export function getSubmittableFields(
  values: Record<string, unknown>
): string[] {
  const fields: string[] = [...BASE_SUBMITTABLE_FIELDS]
  if (values.maritalStatus === "MARRIED") {
    fields.push("spouseName")
  }
  if (values.baptized === "YES") {
    fields.push("baptismPlace", "baptizedBy")
  }
  if (values.beenOnDiscipline === "YES") {
    fields.push("disciplineReason")
  }
  return fields
}

export function countFilledSubmittable(
  values: Record<string, unknown>
): number {
  return getSubmittableFields(values).filter((key) =>
    isNonEmpty(values[key])
  ).length
}

export function submittableProgress(
  values: Record<string, unknown>
): number {
  const required = getSubmittableFields(values)
  return Math.round((countFilledSubmittable(values) / required.length) * 100)
}
