import { normalizeChildName } from "./child-utils"

/**
 * Words that appear on paper forms but are not part of a person's name. They
 * are stripped before matching so "Mrs Mary Doe" finds "Mary Doe".
 */
const HONORIFICS = new Set([
  "mr",
  "mrs",
  "miss",
  "ms",
  "dr",
  "pastor",
  "rev",
  "revd",
  "reverend",
  "deacon",
  "deaconess",
  "elder",
  "sir",
  "lady",
  "chief",
  "evangelist",
  "bro",
  "brother",
  "sis",
  "sister",
  "prophet",
  "apostle",
  "bishop",
  "engr",
  "hon",
])

export type SpouseCandidate = {
  id: string
  name: string
  firstName: string
  surname: string
  otherNames: string | null
  spouseId: string | null
  address: string
  homeCell: string | null
  zone: string | null
  gender: string | null
  maritalStatus: string | null
  children: string[]
  reasons: string[]
}

export type SpouseRankingContext = {
  name: string
  surname?: string
  address?: string
  homeCell?: string
  zone?: string
  childNames?: string[]
  gender?: string | null
}

export type SpouseRankingCandidate = {
  firstName: string
  surname: string
  otherNames?: string | null
  presentAddress: string
  homeCell?: string | null
  zone?: string | null
  gender?: string | null
  children: Array<{ name: string }>
}

export type ChildMatch = {
  memberId: string
  name: string
  address: string
  homeCell: string | null
  zone: string | null
  phoneNumber: string
  spouseId: string | null
  matchedChildren: string[]
  allChildren: string[]
  reasons: string[]
  score: number
}

export type ChildMatchMember = {
  firstName: string
  surname: string
  presentAddress: string
  homeCell?: string | null
  zone?: string | null
}

export type ChildMatchContext = {
  surname?: string
  address?: string
  homeCell?: string
  zone?: string
}

/** Lowercase, strip punctuation/accents, and split into meaningful tokens. */
export function tokenizePersonName(raw: string): string[] {
  return raw
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter(Boolean)
    .filter((token) => !HONORIFICS.has(token))
}

/** Canonical name key. Token order is ignored for comparison. */
export function normalizePersonName(raw: string): string {
  return tokenizePersonName(raw).sort().join(" ")
}

/** Canonical key for addresses, home cells and zones. */
export function normalizePlace(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
}

function formatChildCount(count: number): string {
  return `${count} child${count === 1 ? "" : "ren"}`
}

export function rankSpouseCandidate(
  candidate: SpouseRankingCandidate,
  context: SpouseRankingContext
): { score: number; reasons: string[] } {
  const reasons: string[] = []
  let score = 0

  const targetKey = normalizePersonName(context.name)
  const candidateKey = normalizePersonName(
    `${candidate.firstName} ${candidate.otherNames ?? ""} ${candidate.surname}`
  )

  if (targetKey && candidateKey === targetKey) {
    score += 100
    reasons.push("Exact name match")
  }

  if (
    context.surname &&
    normalizePersonName(context.surname) ===
      normalizePersonName(candidate.surname)
  ) {
    score += 25
    reasons.push("Same surname")
  }

  if (
    context.address &&
    normalizePlace(context.address) === normalizePlace(candidate.presentAddress)
  ) {
    score += 30
    reasons.push("Same address")
  }

  if (
    context.homeCell &&
    candidate.homeCell &&
    normalizePlace(context.homeCell) === normalizePlace(candidate.homeCell)
  ) {
    score += 15
    reasons.push("Same home cell")
  }

  if (
    context.zone &&
    candidate.zone &&
    normalizePlace(context.zone) === normalizePlace(candidate.zone)
  ) {
    score += 10
    reasons.push("Same zone")
  }

  const targetChildren = new Set(
    (context.childNames ?? []).map(normalizeChildName).filter(Boolean)
  )
  const sharedChildren = [
    ...new Set(
      candidate.children
        .map((child) => normalizeChildName(child.name))
        .filter((name) => name && targetChildren.has(name))
    ),
  ]
  if (sharedChildren.length > 0) {
    score += Math.min(sharedChildren.length, 4) * 15
    reasons.push(`${formatChildCount(sharedChildren.length)} match`)
  }

  if (
    context.gender &&
    candidate.gender &&
    context.gender !== candidate.gender
  ) {
    score += 5
  }

  return { score, reasons }
}

export function rankChildMatch(
  matchedChildren: string[],
  member: ChildMatchMember,
  context: ChildMatchContext
): { score: number; reasons: string[] } {
  const reasons = [
    `${formatChildCount(matchedChildren.length)} already recorded`,
  ]
  let score = matchedChildren.length * 20

  if (
    context.surname &&
    normalizePersonName(context.surname) === normalizePersonName(member.surname)
  ) {
    score += 15
    reasons.push("Same surname")
  }

  if (
    context.address &&
    normalizePlace(context.address) === normalizePlace(member.presentAddress)
  ) {
    score += 20
    reasons.push("Same address")
  }

  if (
    context.homeCell &&
    member.homeCell &&
    normalizePlace(context.homeCell) === normalizePlace(member.homeCell)
  ) {
    score += 10
    reasons.push("Same home cell")
  }

  if (
    context.zone &&
    member.zone &&
    normalizePlace(context.zone) === normalizePlace(member.zone)
  ) {
    score += 5
    reasons.push("Same zone")
  }

  return { score, reasons }
}
