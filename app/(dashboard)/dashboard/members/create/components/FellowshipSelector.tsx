"use client"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

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
  if (isLoading) {
    return <div>Loading fellowship groups…</div>
  }

  return (
    <div className="grid gap-3">
      {fellowships.map((fellowship) => {
        const selected = selectedFellowshipIds.includes(fellowship.id)
        return (
          <button
            key={fellowship.id}
            type="button"
            onClick={() => {
              const nextIds = selected
                ? selectedFellowshipIds.filter((id) => id !== fellowship.id)
                : [...selectedFellowshipIds, fellowship.id]
              onChange(nextIds)
            }}
            className={cn(
              "rounded-lg border p-4 text-left transition",
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
              <Checkbox checked={selected} disabled />
            </div>
            {selected && <Badge className="mt-3 inline-flex">Selected</Badge>}
          </button>
        )
      })}
    </div>
  )
}

export default FellowshipSelector
