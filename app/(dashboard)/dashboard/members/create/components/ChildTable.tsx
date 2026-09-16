"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus, X } from "lucide-react"

interface ChildRow {
  name: string
  contact: string
}

interface ChildTableProps {
  childrenList: ChildRow[]
  onChildUpdate: (index: number, field: keyof ChildRow, value: string) => void
  onChildRemove: (index: number) => void
  onChildAdd: () => void
}

export const ChildTable: React.FC<ChildTableProps> = ({
  childrenList,
  onChildUpdate,
  onChildRemove,
  onChildAdd,
}) => {
  return (
    <div className="space-y-4">
      {childrenList.length === 0 && (
        <p className="text-sm text-slate-500">
          No children added yet. Use “Add Child” if applicable.
        </p>
      )}
      <div className="space-y-3">
        {childrenList.map((child, idx) => (
          <div
            key={`child-${idx}`}
            className="grid grid-cols-[1fr_auto] gap-2 rounded-lg border border-slate-200 bg-white p-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end"
          >
            <div className="min-w-0">
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Child Name
              </label>
              <Input
                className="w-full min-w-0"
                value={child.name}
                placeholder="Child full name"
                onChange={(event) =>
                  onChildUpdate(idx, "name", event.target.value)
                }
              />
            </div>
            <div className="min-w-0">
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Contact Details
              </label>
              <Input
                className="w-full min-w-0"
                value={child.contact}
                placeholder="080... (optional)"
                inputMode="tel"
                onChange={(event) =>
                  onChildUpdate(idx, "contact", event.target.value)
                }
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-red-600"
              aria-label={`Remove child ${idx + 1}`}
              onClick={() => onChildRemove(idx)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="secondary"
        onClick={onChildAdd}
        className="gap-2"
      >
        <Plus className="h-4 w-4" /> Add Child
      </Button>
    </div>
  )
}

export default ChildTable
