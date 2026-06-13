// components/rhf-fellowship-selector.tsx
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { FellowshipSelector } from "./fellowship-selector"

type Props<T extends FieldValues> = {
  control: Control<T>
  name: FieldPath<T>
  label: string
  required?: boolean
}

export function RHFFellowshipSelector<T extends FieldValues>({
  control,
  name,
  label,
  required = false,
}: Props<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field>
          <FieldLabel>
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </FieldLabel>
          <FellowshipSelector
            value={field.value || []}
            onChange={field.onChange}
          />
          {fieldState.error && (
            <FieldError>{fieldState.error.message}</FieldError>
          )}
        </Field>
      )}
    />
  )
}
