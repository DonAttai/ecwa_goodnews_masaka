"use client"

import * as React from "react"
import { Controller, Control } from "react-hook-form"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import RequiredLabel from "../components/RequiredLabel"
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
}

export default function FamilyFellowshipStep({
  control,
  childrenList,
  onChildAdd,
  onChildRemove,
  onChildUpdate,
  fellowships,
  isLoadingFellowships,
}: FamilyFellowshipStepProps) {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 rounded-lg border border-slate-200 bg-slate-50 p-6">
        <div className="flex items-center justify-between">
          <FieldLabel>Children</FieldLabel>
          <RequiredLabel />
        </div>
        <ChildTable
          childrenList={childrenList}
          onChildAdd={onChildAdd}
          onChildRemove={onChildRemove}
          onChildUpdate={onChildUpdate}
        />
      </div>

      <div className="grid gap-4 rounded-lg border border-slate-200 bg-slate-50 p-6">
        <div className="flex items-center justify-between">
          <FieldLabel>Fellowship Groups</FieldLabel>
          <RequiredLabel />
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
