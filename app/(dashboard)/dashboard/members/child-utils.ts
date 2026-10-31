/**
 * Canonical key for comparing child names across a couple's records.
 * Case, punctuation and extra whitespace are ignored so "John  Doe" and
 * "john doe" are treated as the same child.
 */
export function normalizeChildName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .replace(/\s+/g, " ")
}
