// sections/spiritual-status.tsx

import { UseFormReturn, useWatch } from "react-hook-form"

import { MemberFormValues } from "@/app/(dashboard)/dashboard/members/schemas"

import { RHFCheckbox } from "../fields/rhf-checkbox"
import { RHFInput } from "../fields/rhf-input"
import { PartialMemberFormValues } from "../../../[memberId]/edit/components/update-member-form"

type Props = {
  form: UseFormReturn<PartialMemberFormValues>
}

export function SpiritualStatus({ form }: Props) {
  const baptized = useWatch({
    control: form.control,
    name: "baptized",
  })
  const isBaptized = baptized === "YES"
  return (
    <section className="space-y-6">
      <h3 className="text-lg font-semibold">Spiritual Status</h3>

      <div className="grid gap-4">
        <RHFCheckbox
          control={form.control}
          name="acceptedChrist"
          label="Accepted Christ"
        />

        <RHFCheckbox control={form.control} name="baptized" label="Baptized" />

        <RHFCheckbox
          control={form.control}
          name="communicant"
          label="Communicant"
        />
      </div>

      {isBaptized && (
        <div className="grid gap-4 md:grid-cols-2">
          <RHFInput
            control={form.control}
            name="baptismPlace"
            label="Baptism Place"
          />

          <RHFInput
            control={form.control}
            name="baptizedBy"
            label="Baptized By"
          />
        </div>
      )}
    </section>
  )
}
