"use client"

export const MEMBER_DRAFT_KEY = "ecwa:member-draft:v1"
export const MEMBER_DRAFT_TTL_MS = 7 * 24 * 60 * 60 * 1000 // 7 days

export interface MemberDraft {
  values: Record<string, unknown>
  passportUrl: string | null
  currentStep: number
  savedAt: string
}

export function saveDraft(draft: MemberDraft, key = MEMBER_DRAFT_KEY): void {
  try {
    if (typeof window === "undefined") return
    window.localStorage.setItem(key, JSON.stringify(draft))
  } catch {
    // storage full / private mode — fail silently, form still works
  }
}

export function loadDraft(key = MEMBER_DRAFT_KEY): MemberDraft | null {
  try {
    if (typeof window === "undefined") return null
    const raw = window.localStorage.getItem(key)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<MemberDraft>
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      typeof parsed.currentStep !== "number" ||
      typeof parsed.values !== "object" ||
      parsed.values === null
    ) {
      return null
    }
    if (parsed.savedAt) {
      const age = Date.now() - new Date(parsed.savedAt).getTime()
      if (Number.isFinite(age) && age > MEMBER_DRAFT_TTL_MS) {
        window.localStorage.removeItem(key)
        return null
      }
    }
    return {
      values: parsed.values as Record<string, unknown>,
      passportUrl:
        typeof parsed.passportUrl === "string" ? parsed.passportUrl : null,
      currentStep: parsed.currentStep,
      savedAt:
        typeof parsed.savedAt === "string"
          ? parsed.savedAt
          : new Date().toISOString(),
    }
  } catch {
    return null
  }
}

export function clearDraft(key = MEMBER_DRAFT_KEY): void {
  try {
    if (typeof window === "undefined") return
    window.localStorage.removeItem(key)
  } catch {
    // ignore
  }
}
