import type { MemberCreateInput, MemberUpdateInput } from "./schemas"

/**
 * Converts a validated member form payload into a `FormData` object suitable
 * for server actions. Lists (children / fellowship groups) are serialized as
 * JSON strings; booleans map to "YES"/"NO".
 *
 * This centralizes the previously duplicated FormData-build logic shared by
 * the registration and update forms.
 */
export function toMemberFormData(
  values: Partial<MemberCreateInput | MemberUpdateInput>
): FormData {
  const formData = new FormData()

  for (const [key, value] of Object.entries(values)) {
    if (value === undefined || value === null || value === "") continue

    if (key === "children" || key === "fellowshipGroupIds") {
      formData.append(key, JSON.stringify(value))
    } else if (typeof value === "boolean") {
      formData.append(key, value ? "YES" : "NO")
    } else if (Array.isArray(value)) {
      formData.append(key, JSON.stringify(value))
    } else if (value instanceof Date) {
      formData.append(key, value.toISOString())
    } else {
      formData.append(key, String(value))
    }
  }

  return formData
}
