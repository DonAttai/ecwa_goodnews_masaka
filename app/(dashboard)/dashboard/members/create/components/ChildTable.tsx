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
      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 p-2">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead>
            <tr className="text-left text-slate-600">
              <th className="px-3 py-2">Child Name</th>
              <th className="px-3 py-2">Contact Details</th>
              <th className="px-3 py-2">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {childrenList.map((child, idx) => (
              <tr key={`child-${idx}`}>
                <td className="px-3 py-2">
                  <Input
                    value={child.name}
                    onChange={(event) =>
                      onChildUpdate(idx, "name", event.target.value)
                    }
                  />
                </td>
                <td className="px-3 py-2">
                  <Input
                    value={child.contact}
                    onChange={(event) =>
                      onChildUpdate(idx, "contact", event.target.value)
                    }
                  />
                </td>
                <td className="px-3 py-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-red-600"
                    onClick={() => onChildRemove(idx)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
