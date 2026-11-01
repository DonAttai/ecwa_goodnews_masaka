"use client"

import * as React from "react"
import { Loader2, MapPin, Unlink, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { searchMembersForSpouse } from "../actions"
import type { SpouseCandidate } from "../matching"

export type SpouseOption = SpouseCandidate

interface SpousePickerProps {
  value?: string | null
  spouseName?: string | null
  currentMemberId?: string
  surname?: string
  address?: string
  homeCell?: string
  zone?: string
  childNames?: string[]
  gender?: string | null
  onChange: (spouse: SpouseCandidate | null) => void
}

export function SpousePicker({
  value,
  spouseName,
  currentMemberId,
  surname,
  address,
  homeCell,
  zone,
  childNames,
  gender,
  onChange,
}: SpousePickerProps) {
  const [results, setResults] = React.useState<SpouseCandidate[]>([])
  const [isSearching, setIsSearching] = React.useState(false)
  const [searchedTerm, setSearchedTerm] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)

  const term = (spouseName ?? "").trim()
  const childKey = (childNames ?? []).join("\u0000")

  React.useEffect(() => {
    if (value) return

    if (term.length < 2) {
      setResults([])
      setIsSearching(false)
      setSearchedTerm("")
      setError(null)
      return
    }

    let cancelled = false
    setIsSearching(true)
    const timer = setTimeout(async () => {
      try {
        const found = await searchMembersForSpouse({
          name: term,
          excludeId: currentMemberId,
          surname,
          address,
          homeCell,
          zone,
          childNames: childKey ? childKey.split("\u0000") : [],
          gender,
        })
        if (!cancelled) {
          setResults(found)
          setSearchedTerm(term)
          setError(null)
        }
      } catch {
        if (!cancelled) setError("Could not search members. Try again.")
      } finally {
        if (!cancelled) setIsSearching(false)
      }
    }, 400)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [
    term,
    value,
    currentMemberId,
    surname,
    address,
    homeCell,
    zone,
    childKey,
    gender,
  ])

  if (value) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3">
        <div className="flex items-center gap-2 text-sm">
          <Users className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <span>
            Linked to{" "}
            <strong className="font-semibold">
              {spouseName || "registered spouse"}
            </strong>
          </span>
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="gap-1.5"
          onClick={() => onChange(null)}
        >
          <Unlink className="h-3.5 w-3.5" />
          Unlink
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {term.length < 2 && (
        <p className="text-xs text-muted-foreground">
          Type the spouse&apos;s full name from the membership form — registered
          members will appear here automatically.
        </p>
      )}

      {isSearching && (
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Looking for “{term}”…
        </p>
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}

      {!isSearching &&
        term.length >= 2 &&
        searchedTerm === term &&
        results.length === 0 && (
          <p className="text-xs text-muted-foreground">
            No registered member found for “{term}”. You can save now and link
            the spouse later from the member&apos;s page.
          </p>
        )}

      {results.length > 0 && searchedTerm === term && (
        <>
          <ul className="divide-y overflow-hidden rounded-lg border">
            {results.map((member) => {
              const alreadyLinked =
                Boolean(member.spouseId) && member.spouseId !== currentMemberId
              return (
                <li key={member.id}>
                  <button
                    type="button"
                    disabled={alreadyLinked}
                    onClick={() => onChange(member)}
                    className="flex w-full items-start justify-between gap-3 px-3 py-2 text-left text-sm transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <span className="min-w-0 space-y-0.5">
                      <span className="block truncate font-medium">
                        {member.name}
                      </span>
                      {member.address && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3 shrink-0" />
                          <span className="truncate">{member.address}</span>
                        </span>
                      )}
                      <span className="block text-xs text-muted-foreground">
                        {member.children.length > 0
                          ? `${member.children.length} child${member.children.length === 1 ? "" : "ren"} recorded`
                          : "No children recorded"}
                        {member.reasons.length > 0
                          ? ` · ${member.reasons.join(" · ")}`
                          : ""}
                      </span>
                    </span>
                    {alreadyLinked ? (
                      <Badge variant="outline" className="shrink-0 text-xs">
                        Already linked
                      </Badge>
                    ) : (
                      <Badge className="shrink-0 text-xs">Link</Badge>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
          <p className="text-xs text-muted-foreground">
            Click the right person to link. The app never links a spouse
            automatically.
          </p>
        </>
      )}
    </div>
  )
}
