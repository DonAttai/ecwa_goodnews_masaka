"use client"

import { Controller, Control } from "react-hook-form"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Badge } from "@/components/ui/badge"
import ChildTable from "../components/ChildTable"
import FellowshipSelector from "../components/FellowshipSelector"
import { MemberFormValues } from "../../schemas"

interface FamilyFellowshipStepProps {
  control: Control<MemberFormValues>
  childrenList: Array<{ name: string; contact: string }>
  onChildAdd: () => void
  onChildRemove: (index: number) => void
  onChildUpdate: (
    index: number,
    field: "name" | "contact",
    value: string
  ) => void
  fellowships: Array<{ id: string; name: string; description?: string }>
  isLoadingFellowships: boolean
  showChildrenField: boolean
}

export default function FamilyFellowshipStep({
  control,
  childrenList,
  onChildAdd,
  onChildRemove,
  onChildUpdate,
  fellowships,
  isLoadingFellowships,
  showChildrenField, // Make sure to destructure this
}: FamilyFellowshipStepProps) {
  return (
    <div className="space-y-8">
      {/* Children Section - Only show when not single */}
      {showChildrenField && (
        <div className="grid gap-4 rounded-lg border border-slate-200 bg-slate-50 p-6">
          <div className="flex items-center justify-between">
            <FieldLabel>Children</FieldLabel>
            <Badge variant="outline">Optional</Badge>
          </div>
          <ChildTable
            childrenList={childrenList}
            onChildAdd={onChildAdd}
            onChildRemove={onChildRemove}
            onChildUpdate={onChildUpdate}
          />
          <Controller
            control={control}
            name="children"
            render={({ fieldState }) => (
              <FieldError>{fieldState.error?.message}</FieldError>
            )}
          />
        </div>
      )}

      {/* Fellowship Groups Section - Always visible */}
      <div className="grid gap-4 rounded-lg border border-slate-200 bg-slate-50 p-6">
        <div className="flex items-center justify-between">
          <FieldLabel>Fellowship Groups</FieldLabel>
          <Badge variant="outline">Optional</Badge>
        </div>
        <Controller
          control={control}
          name="fellowshipGroupIds"
          render={({ field, fieldState }) => (
            <Field>
              <FellowshipSelector
                fellowships={fellowships}
                selectedFellowshipIds={field.value || []}
                isLoading={isLoadingFellowships}
                onChange={field.onChange}
              />
              <FieldError>{fieldState.error?.message}</FieldError>
            </Field>
          )}
        />
      </div>
    </div>
  )
}
