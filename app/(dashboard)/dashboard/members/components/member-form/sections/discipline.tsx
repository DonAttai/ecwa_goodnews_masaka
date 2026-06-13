// sections/discipline.tsx

import { UseFormReturn, useWatch } from "react-hook-form"

import { MemberFormValues } from "@/app/(dashboard)/dashboard/members/schemas"

import { RHFCheckbox } from "../fields/rhf-checkbox"
import { RHFInput } from "../fields/rhf-input"
import { PartialMemberFormValues } from "../../../[memberId]/edit/components/update-member-form"

type Props = {
  form: UseFormReturn<PartialMemberFormValues>
}

export function Discipline({ form }: Props) {
  const beenOnDiscipline = useWatch({
    control: form.control,
    name: "beenOnDiscipline",
  })

  const isBeenOnDiscipline = beenOnDiscipline === "YES"

  return (
    <section className="space-y-6">
      <h3 className="text-lg font-semibold">Discipline</h3>

      <RHFCheckbox
        control={form.control}
        name="beenOnDiscipline"
        label="Been On Discipline"
      />

      {isBeenOnDiscipline && (
        <>
          <RHFInput
            control={form.control}
            name="disciplineReason"
            label="Discipline Reason"
          />

          <div className="grid gap-4 md:grid-cols-2">
            <RHFInput
              control={form.control}
              name="disciplineDate"
              label="Discipline Date"
              type="date"
            />

            <RHFInput
              control={form.control}
              name="disciplineReliefDate"
              label="Relief Date"
              type="date"
            />
          </div>
        </>
      )}
    </section>
  )
}
