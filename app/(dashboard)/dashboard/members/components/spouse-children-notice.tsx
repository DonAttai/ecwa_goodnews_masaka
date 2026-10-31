"use client"

import * as React from "react"
import { AlertCircle, Loader2 } from "lucide-react"

import { getSpouseChildren } from "../actions"

export function SpouseChildrenNotice({
  spouseId,
}: {
  spouseId?: string | null
}) {
  const [state, setState] = React.useState<{
    name: string
    children: string[]
  } | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)

  React.useEffect(() => {
    if (!spouseId) {
      setState(null)
      setIsLoading(false)
      return
    }

    let cancelled = false
    setIsLoading(true)
    getSpouseChildren(spouseId)
      .then((result) => {
        if (!cancelled) setState(result)
      })
      .catch(() => {
        if (!cancelled) setState(null)
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [spouseId])

  if (isLoading) {
    return (
      <p className="flex items-center gap-2 text-xs text-muted-foreground">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        Checking children already recorded under the linked spouse…
      </p>
    )
  }

  if (!state || state.children.length === 0) return null

  return (
    <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
      <p className="flex items-center gap-2 text-sm font-medium text-amber-800 dark:text-amber-300">
        <AlertCircle className="h-4 w-4 shrink-0" />
        Already recorded under {state.name}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        {state.children.join(", ")}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        These children already show on both records. Do not add them again here.
      </p>
    </div>
  )
}
