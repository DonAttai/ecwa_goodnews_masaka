"use client"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { useCallback } from "react"

interface FellowshipGroup {
  id: string
  name: string
  description?: string
}

interface FellowshipSelectorProps {
  fellowships: FellowshipGroup[]
  selectedFellowshipIds: string[]
  isLoading: boolean
  onChange: (nextIds: string[]) => void
}

export const FellowshipSelector: React.FC<FellowshipSelectorProps> = ({
  fellowships,
  selectedFellowshipIds,
  isLoading,
  onChange,
}) => {
  const handleToggle = useCallback(
    (fellowshipId: string, currentlySelected: boolean) => {
      const nextIds = currentlySelected
        ? selectedFellowshipIds.filter((id) => id !== fellowshipId)
        : [...selectedFellowshipIds, fellowshipId]
      onChange(nextIds)
    },
    [selectedFellowshipIds, onChange]
  )

  if (isLoading) {
    return <div>Loading fellowship groups…</div>
  }

  return (
    <div className="grid gap-3">
      {fellowships.map((fellowship) => {
        const selected = selectedFellowshipIds.includes(fellowship.id)
        return (
          <div
            key={fellowship.id}
            onClick={() => handleToggle(fellowship.id, selected)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                handleToggle(fellowship.id, selected)
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
                    // 'checked' is the new state (true/false)
                    handleToggle(fellowship.id, !selected)
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

export default FellowshipSelector
