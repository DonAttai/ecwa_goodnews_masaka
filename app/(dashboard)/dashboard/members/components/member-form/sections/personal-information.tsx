import { UseFormReturn } from "react-hook-form"

import { MemberFormValues } from "@/app/(dashboard)/dashboard/members/schemas"

import { RHFInput } from "../fields/rhf-input"
import { PartialMemberFormValues } from "../../../[memberId]/edit/components/update-member-form"

type Props = {
  form: UseFormReturn<PartialMemberFormValues>
}

export function PersonalInformation({ form }: Props) {
  return (
    <section className="space-y-4">
      <h3 className="text-lg font-semibold">Personal Information</h3>

      <div className="grid gap-4 md:grid-cols-2">
        <RHFInput
          control={form.control}
          name="surname"
          label="Surname"
          required
        />

        <RHFInput
          control={form.control}
          name="firstName"
          label="First Name"
          required
        />

        <RHFInput
          control={form.control}
          name="otherNames"
          label="Other Names"
        />

        <RHFInput
          control={form.control}
          name="phoneNumber"
          label="Phone Number"
          required
        />

        <RHFInput
          control={form.control}
          name="email"
          label="Email"
          type="email"
        />

        <RHFInput
          control={form.control}
          name="presentAddress"
          label="Address"
          required
        />
      </div>
    </section>
  )
}
