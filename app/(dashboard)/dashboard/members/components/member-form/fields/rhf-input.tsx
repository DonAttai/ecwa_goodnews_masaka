import { Control, Controller, FieldPath, FieldValues } from "react-hook-form"

import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"

import { Input } from "@/components/ui/input"

type Props<T extends FieldValues> = {
  control: Control<T>
  name: FieldPath<T>
  label: string
  placeholder?: string
  type?: string
  required?: boolean
}

export function RHFInput<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = "text",
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

          <FieldContent>
            <Input
              {...field}
              value={field.value ?? ""}
              placeholder={placeholder}
              type={type}
              required={required}
            />

            {fieldState.error && (
              <FieldError>{fieldState.error.message}</FieldError>
            )}
          </FieldContent>
        </Field>
      )}
    />
  )
}
