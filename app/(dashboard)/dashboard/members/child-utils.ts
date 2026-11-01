/**
 * Canonical key for comparing child names across a couple's records.
 * Case, punctuation and extra whitespace are ignored so "John  Doe",
 * "john-doe" and "john doe" are treated as the same child.
 */
export function normalizeChildName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
}

/** Child names that appear in both lists, compared by canonical key. */
export function findChildNameOverlap(
  children: Array<{ name: string }>,
  otherChildren: Array<{ name: string }>
): string[] {
  const otherKeys = new Set(
    otherChildren.map((child) => normalizeChildName(child.name))
  )
  return children
    .filter((child) => otherKeys.has(normalizeChildName(child.name)))
    .map((child) => child.name)
}

/** Names submitted more than once within the same list. */
export function findInternalChildDuplicates(
  children: Array<{ name: string }>
): string[] {
  const seen = new Set<string>()
  const duplicates = new Set<string>()
  for (const child of children) {
    const key = normalizeChildName(child.name)
    if (!key) continue
    if (seen.has(key)) duplicates.add(child.name)
    seen.add(key)
  }
  return [...duplicates]
}

export function uniqueChildKeys(names: string[]): string[] {
  return [
    ...new Set(
      names.map((name) => normalizeChildName(name)).filter((name) => name)
    ),
  ]
}
