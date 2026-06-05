"use client"

import * as React from "react"
import { Controller, Control } from "react-hook-form"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"
import { MemberFormValues } from "../../schemas"

interface RecommendationsStepProps {
  control: Control<MemberFormValues>
}

export default function RecommendationsStep({
  control,
}: RecommendationsStepProps) {
  return (
    <div className="space-y-4">
      <Controller
        control={control}
        name="suggestions"
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel>Recommendations / Remarks</FieldLabel>
            <Textarea
              {...field}
              placeholder="Any suggestions or notes"
              rows={5}
            />
            <FieldError>{fieldState.error?.message}</FieldError>
          </Field>
        )}
      />
    </div>
  )
}
