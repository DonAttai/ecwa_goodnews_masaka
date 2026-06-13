"use client"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { useCallback, useEffect, useState } from "react"

interface FellowshipGroup {
  id: string
  name: string
  description?: string
}

interface FellowshipSelectorProps {
  value: string[]
  onChange: (value: string[]) => void
  isLoading?: boolean
}

export function FellowshipSelector({
  value,
  onChange,
  isLoading,
}: FellowshipSelectorProps) {
  const [fellowships, setFellowships] = useState<FellowshipGroup[]>([])
  const [isLocalLoading, setIsLocalLoading] = useState(false)

  useEffect(() => {
    const fetchFellowships = async () => {
      setIsLocalLoading(true)
      try {
        const response = await fetch("/api/fellowships")
        const data = await response.json()
        setFellowships(data)
      } catch (error) {
        console.error("Failed to fetch fellowships:", error)
      } finally {
        setIsLocalLoading(false)
      }
    }

    fetchFellowships()
  }, [])

  const handleToggle = useCallback(
    (fellowshipId: string, shouldSelect: boolean) => {
      const nextIds = shouldSelect
        ? [...value, fellowshipId]
        : value.filter((id) => id !== fellowshipId)
      onChange(nextIds)
    },
    [value, onChange]
  )

  const loading = isLoading || isLocalLoading

  if (loading) {
    return (
      <div className="text-sm text-muted-foreground">
        Loading fellowship groups...
      </div>
    )
  }

  if (fellowships.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        No fellowship groups available
      </div>
    )
  }

  return (
    <div className="grid gap-3">
      {fellowships.map((fellowship) => {
        const selected = value.includes(fellowship.id)
        return (
          <div
            key={fellowship.id}
            onClick={() => handleToggle(fellowship.id, !selected)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                handleToggle(fellowship.id, !selected)
              }
            }}
            className={cn(
              "cursor-pointer rounded-lg border p-4 text-left transition",
              selected
                ? "border-primary bg-primary/10"
                : "border-slate-200 bg-white hover:border-slate-300"
            )}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold">{fellowship.name}</p>
                {fellowship.description && (
                  <p className="mt-1 text-sm text-slate-600">
                    {fellowship.description}
                  </p>
                )}
              </div>
              <div onClick={(e) => e.stopPropagation()}>
                <Checkbox
                  checked={selected}
                  onCheckedChange={(checked) => {
                    handleToggle(fellowship.id, Boolean(checked))
                  }}
                />
              </div>
            </div>
            {selected && <Badge className="mt-3 inline-flex">Selected</Badge>}
          </div>
        )
      })}
    </div>
  )
}
