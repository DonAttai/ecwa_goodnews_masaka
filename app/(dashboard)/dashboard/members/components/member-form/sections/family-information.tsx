// sections/family-information.tsx

import {
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  UseFormReturn,
  useWatch,
} from "react-hook-form"
import { Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { RHFInput } from "../fields/rhf-input"
import { RHFSelect } from "../fields/rhf-select"
import { SpousePicker } from "../../../components/spouse-picker"
import { SpouseChildrenNotice } from "../../../components/spouse-children-notice"
import { ChildDuplicateNotice } from "../../../components/child-duplicate-notice"
import { normalizeChildName } from "../../../child-utils"
import type { ChildMatch } from "../../../matching"
import { toast } from "sonner"

import { PartialMemberFormValues } from "../../../[memberId]/edit/components/update-member-form"

type Props = {
  form: UseFormReturn<PartialMemberFormValues>
  fields: {
    id: string
  }[]
  append: UseFieldArrayAppend<PartialMemberFormValues, "children">
  remove: UseFieldArrayRemove
  currentMemberId?: string
  childDuplicateAcks: string[]
  onChildDuplicateAcksChange: (names: string[]) => void
}

export function FamilyInformation({
  form,
  fields,
  append,
  remove,
  currentMemberId,
  childDuplicateAcks,
  onChildDuplicateAcksChange,
}: Props) {
  const maritalStatus = useWatch({
    control: form.control,
    name: "maritalStatus",
  })
  const spouseId = useWatch({
    control: form.control,
    name: "spouseId",
  })
  const spouseName = useWatch({
    control: form.control,
    name: "spouseName",
  })
  const surname = useWatch({ control: form.control, name: "surname" })
  const address = useWatch({ control: form.control, name: "presentAddress" })
  const homeCell = useWatch({ control: form.control, name: "homeCell" })
  const zone = useWatch({ control: form.control, name: "zone" })
  const gender = useWatch({ control: form.control, name: "gender" }) as
    | "MALE"
    | "FEMALE"
    | undefined
  const children = useWatch({ control: form.control, name: "children" })

  const linkFamily = (match: ChildMatch, matchedNames: string[]) => {
    form.setValue("spouseId", match.memberId, { shouldDirty: true })
    form.setValue("spouseName", match.name, {
      shouldDirty: true,
      shouldValidate: true,
    })

    const keys = new Set(matchedNames.map(normalizeChildName))
    const current = (form.getValues("children") ?? []) as Array<{
      id?: string
      name: string
      contact?: string
    }>
    form.setValue(
      "children",
      current.filter((child) => !keys.has(normalizeChildName(child.name))),
      { shouldDirty: true, shouldValidate: true }
    )

    toast.success(`${match.name} linked. Matching children are now shared.`)
  }

  return (
    <section className="space-y-6">
      <h3 className="text-lg font-semibold">Family Information</h3>

      <div className="grid gap-4 md:grid-cols-2">
        <RHFSelect
          control={form.control}
          name="maritalStatus"
          label="Marital Status"
          options={[
            {
              label: "Single",
              value: "SINGLE",
            },
            {
              label: "Married",
              value: "MARRIED",
            },
            {
              label: "Divorced",
              value: "DIVORCED",
            },
            {
              label: "Widowed",
              value: "WIDOWED",
            },
          ]}
        />

        {maritalStatus === "MARRIED" && (
          <>
            <RHFInput
              control={form.control}
              name="spouseName"
              label="Spouse Name"
            />
            <SpousePicker
              value={spouseId}
              spouseName={spouseName}
              currentMemberId={currentMemberId}
              surname={surname}
              address={address}
              homeCell={homeCell}
              zone={zone}
              childNames={(children ?? []).map((child) => child.name)}
              gender={gender}
              onChange={(spouse) => {
                form.setValue("spouseId", spouse?.id ?? "", {
                  shouldDirty: true,
                })
                if (spouse) {
                  form.setValue("spouseName", spouse.name, {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
              }}
            />
          </>
        )}
      </div>

      <SpouseChildrenNotice spouseId={spouseId} />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">Children</h4>

          <Button
            type="button"
            variant="outline"
            onClick={() =>
              append({
                name: "",
                contact: "",
              })
            }
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Child
          </Button>
        </div>

        {fields.map((field, index) => (
          <div key={field.id} className="rounded-lg border p-4">
            <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
              <RHFInput
                control={form.control}
                name={`children.${index}.name`}
                label="Name"
              />

              <RHFInput
                control={form.control}
                name={`children.${index}.contact`}
                label="Contact"
              />

              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="mt-8"
                onClick={() => remove(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}

        <ChildDuplicateNotice
          childNames={(children ?? []).map((child) => child.name)}
          currentMemberId={currentMemberId}
          spouseId={spouseId}
          surname={surname}
          address={address}
          homeCell={homeCell}
          zone={zone}
          acknowledgedNames={childDuplicateAcks}
          onLinkFamily={linkFamily}
          onAcknowledgedChange={onChildDuplicateAcksChange}
        />
      </div>
    </section>
  )
}
