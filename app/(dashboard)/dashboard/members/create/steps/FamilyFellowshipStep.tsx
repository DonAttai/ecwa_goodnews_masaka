"use client"

import { Controller, Control, useWatch } from "react-hook-form"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Badge } from "@/components/ui/badge"
import ChildTable from "../components/ChildTable"
import FellowshipSelector from "../components/FellowshipSelector"
import { SpouseChildrenNotice } from "../../components/spouse-children-notice"
import { ChildDuplicateNotice } from "../../components/child-duplicate-notice"
import { MemberFormValues } from "../../schemas"
import type { ChildMatch } from "../../matching"

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
  childDuplicateAcks: string[]
  onLinkFamily: (match: ChildMatch, matchedNames: string[]) => void
  onChildDuplicateAcksChange: (names: string[]) => void
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
  childDuplicateAcks,
  onLinkFamily,
  onChildDuplicateAcksChange,
}: FamilyFellowshipStepProps) {
  const spouseId = useWatch({ control, name: "spouseId" })
  const surname = useWatch({ control, name: "surname" })
  const address = useWatch({ control, name: "presentAddress" })
  const homeCell = useWatch({ control, name: "homeCell" })
  const zone = useWatch({ control, name: "zone" })

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
          <SpouseChildrenNotice spouseId={spouseId} />
          <ChildDuplicateNotice
            childNames={childrenList.map((child) => child.name)}
            spouseId={spouseId}
            surname={surname}
            address={address}
            homeCell={homeCell}
            zone={zone}
            acknowledgedNames={childDuplicateAcks}
            onLinkFamily={onLinkFamily}
            onAcknowledgedChange={onChildDuplicateAcksChange}
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
