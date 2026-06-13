// sections/church-life.tsx
import { UseFormReturn } from "react-hook-form"
import { RHFFellowshipSelector } from "../rhf-fellowship-selector"
import { RHFInput } from "../fields/rhf-input"
import { PartialMemberFormValues } from "../../../[memberId]/edit/components/update-member-form"

type Props = {
  form: UseFormReturn<PartialMemberFormValues>
}

export function ChurchLife({ form }: Props) {
  return (
    <section className="space-y-6">
      <h3 className="text-lg font-semibold">Church Life</h3>

      <div className="grid gap-4 md:grid-cols-2">
        <RHFInput control={form.control} name="homeCell" label="Home Cell" />
        <RHFInput control={form.control} name="zone" label="Zone" />
      </div>

      <RHFFellowshipSelector
        control={form.control}
        name="fellowshipGroupIds"
        label="Fellowship Groups"
      />
    </section>
  )
}
