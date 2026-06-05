"use client"

import * as React from "react"
import { Controller, Control } from "react-hook-form"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { MemberFormValues } from "../../schemas"

interface DeclarationStepProps {
  control: Control<MemberFormValues>
}

export default function DeclarationStep({ control }: DeclarationStepProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
        <p className="text-lg font-semibold">Declaration</p>
        <p className="mt-2 text-sm text-slate-600">
          I hereby declare that the information provided in this membership form
          is true and correct to the best of my knowledge.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Controller
          control={control}
          name="memberSignature"
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Member Signature</FieldLabel>
              <Input {...field} placeholder="Member name" />
              <FieldError>{fieldState.error?.message}</FieldError>
            </Field>
          )}
        />

        <Controller
          control={control}
          name="memberSignedDate"
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Member Signed Date</FieldLabel>
              <Input {...field} value={field.value ?? ""} type="date" />
              <FieldError>{fieldState.error?.message}</FieldError>
            </Field>
          )}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Controller
          control={control}
          name="pastorSignature"
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Pastor Signature</FieldLabel>
              <Input {...field} placeholder="Pastor name" />
              <FieldError>{fieldState.error?.message}</FieldError>
            </Field>
          )}
        />

        <Controller
          control={control}
          name="pastorSignedDate"
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Pastor Signed Date</FieldLabel>
              <Input {...field} value={field.value ?? ""} type="date" />
              <FieldError>{fieldState.error?.message}</FieldError>
            </Field>
          )}
        />
      </div>
    </div>
  )
}
