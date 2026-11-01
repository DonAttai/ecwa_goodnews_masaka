"use client"

import * as React from "react"
import { AlertTriangle, Link2, Loader2, MapPin } from "lucide-react"

import { Button } from "@/components/ui/button"
import { findChildMatches } from "../actions"
import { normalizeChildName } from "../child-utils"
import type { ChildMatch } from "../matching"

interface ChildDuplicateNoticeProps {
  childNames: string[]
  currentMemberId?: string
  spouseId?: string | null
  surname?: string
  address?: string
  homeCell?: string
  zone?: string
  acknowledgedNames: string[]
  onLinkFamily: (match: ChildMatch, matchedNames: string[]) => void
  onAcknowledgedChange: (names: string[]) => void
}

export function ChildDuplicateNotice({
  childNames,
  currentMemberId,
  spouseId,
  surname,
  address,
  homeCell,
  zone,
  acknowledgedNames,
  onLinkFamily,
  onAcknowledgedChange,
}: ChildDuplicateNoticeProps) {
  const [matches, setMatches] = React.useState<ChildMatch[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const childKey = childNames
    .map((name) => normalizeChildName(name))
    .filter(Boolean)
    .join("\u0000")

  React.useEffect(() => {
    const names = childKey ? childKey.split("\u0000") : []
    if (names.length === 0) {
      setMatches([])
      setIsLoading(false)
      setError(null)
      return
    }

    let cancelled = false
    setIsLoading(true)
    const timer = setTimeout(async () => {
      try {
        const found = await findChildMatches({
          names,
          excludeMemberId: currentMemberId,
          excludeSpouseId: spouseId,
          surname,
          address,
          homeCell,
          zone,
        })
        if (!cancelled) {
          setMatches(found)
          setError(null)
        }
      } catch {
        if (!cancelled) {
          setError("Could not check for duplicate children. Try again.")
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }, 500)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [childKey, currentMemberId, spouseId, surname, address, homeCell, zone])

  const acknowledgedSet = new Set(acknowledgedNames)
  const visibleMatches = matches.filter((match) =>
    match.matchedChildren.some(
      (name) => !acknowledgedSet.has(normalizeChildName(name))
    )
  )

  if (isLoading) {
    return (
      <p className="flex items-center gap-2 text-xs text-muted-foreground">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        Checking whether these children are already recorded…
      </p>
    )
  }

  if (error) {
    return <p className="text-xs text-red-500">{error}</p>
  }

  if (visibleMatches.length === 0) return null

  return (
    <div className="space-y-3">
      {visibleMatches.map((match) => {
        const currentLinkedElsewhere =
          Boolean(spouseId) && spouseId !== match.memberId
        const candidateLinkedElsewhere =
          Boolean(match.spouseId) && match.spouseId !== currentMemberId
        const cannotLink = currentLinkedElsewhere || candidateLinkedElsewhere

        return (
          <div
            key={match.memberId}
            className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4"
          >
            <p className="flex items-center gap-2 text-sm font-medium text-amber-800 dark:text-amber-300">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              Already recorded under {match.name}
            </p>
            <p className="mt-1 text-sm font-medium">
              {match.matchedChildren.join(", ")}
            </p>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate">{match.address}</span>
              {match.reasons.length > 0
                ? ` · ${match.reasons.join(" · ")}`
                : ""}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              If this is the same child, link the family so the child is shared
              instead of duplicated. If it is a different child who happens to
              share the name, confirm below.
            </p>

            {cannotLink && (
              <p className="mt-2 text-xs text-amber-800 dark:text-amber-300">
                {candidateLinkedElsewhere
                  ? "That member is already linked to another spouse, so the family cannot be linked. Confirm that these are different children to continue."
                  : "This member is already linked to another spouse. Unlink them first if this is the right family."}
              </p>
            )}

            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                type="button"
                size="sm"
                disabled={cannotLink}
                onClick={() => onLinkFamily(match, match.matchedChildren)}
              >
                <Link2 className="h-3.5 w-3.5" />
                Same child — link family
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() =>
                  onAcknowledgedChange([
                    ...new Set([
                      ...acknowledgedNames,
                      ...match.matchedChildren.map(normalizeChildName),
                    ]),
                  ])
                }
              >
                Different child
              </Button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
