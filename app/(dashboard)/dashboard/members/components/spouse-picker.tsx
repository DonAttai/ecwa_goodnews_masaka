"use client"

import * as React from "react"
import { Loader2, Search, Unlink, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { searchMembersForSpouse } from "../actions"

export interface SpouseOption {
  id: string
  name: string
  spouseId: string | null
  children: string[]
}

interface SpousePickerProps {
  value?: string | null
  spouseName?: string | null
  currentMemberId?: string
  onChange: (spouse: SpouseOption | null) => void
}

export function SpousePicker({
  value,
  spouseName,
  currentMemberId,
  onChange,
}: SpousePickerProps) {
  const [query, setQuery] = React.useState("")
  const [results, setResults] = React.useState<SpouseOption[]>([])
  const [isSearching, setIsSearching] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (value) return
    const term = query.trim()
    if (term.length < 2) {
      setResults([])
      setIsSearching(false)
      return
    }

    let cancelled = false
    setIsSearching(true)
    const timer = setTimeout(async () => {
      try {
        const found = await searchMembersForSpouse(term, currentMemberId)
        if (!cancelled) {
          setResults(found)
          setError(null)
        }
      } catch {
        if (!cancelled) setError("Could not search members. Try again.")
      } finally {
        if (!cancelled) setIsSearching(false)
      }
    }, 300)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [query, value, currentMemberId])

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
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search registered members to link spouse (optional)"
          className="pl-8"
          aria-label="Search registered members to link spouse"
        />
        {isSearching && (
          <Loader2 className="absolute top-1/2 right-2.5 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      {query.trim().length >= 2 && !isSearching && results.length === 0 && (
        <p className="text-xs text-muted-foreground">
          No registered member found. Leave the spouse name above as free text.
        </p>
      )}

      {results.length > 0 && (
        <ul className="divide-y overflow-hidden rounded-lg border">
          {results.map((member) => {
            const alreadyLinked = Boolean(member.spouseId)
            return (
              <li key={member.id}>
                <button
                  type="button"
                  disabled={alreadyLinked}
                  onClick={() => {
                    onChange(member)
                    setQuery("")
                    setResults([])
                  }}
                  className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span className="min-w-0">
                    <span className="block truncate font-medium">
                      {member.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {member.children.length > 0
                        ? `${member.children.length} child${member.children.length === 1 ? "" : "ren"} recorded`
                        : "No children recorded"}
                    </span>
                  </span>
                  {alreadyLinked && (
                    <Badge variant="outline" className="shrink-0 text-xs">
                      Already linked
                    </Badge>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      )}

      <p className="text-xs text-muted-foreground">
        Leave this blank if your spouse is not registered — the name above is
        still saved.
      </p>
    </div>
  )
}
