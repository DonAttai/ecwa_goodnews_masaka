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

import { PartialMemberFormValues } from "../../../[memberId]/edit/components/update-member-form"

type Props = {
  form: UseFormReturn<PartialMemberFormValues>
  fields: {
    id: string
  }[]
  append: UseFieldArrayAppend<PartialMemberFormValues, "children">
  remove: UseFieldArrayRemove
}

export function FamilyInformation({ form, fields, append, remove }: Props) {
  const maritalStatus = useWatch({
    control: form.control,
    name: "maritalStatus",
  })

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
          <RHFInput
            control={form.control}
            name="spouseName"
            label="Spouse Name"
          />
        )}
      </div>

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
      </div>
    </section>
  )
}
