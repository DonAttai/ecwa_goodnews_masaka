import { Control, Controller, FieldPath, FieldValues } from "react-hook-form"

import { Checkbox } from "@/components/ui/checkbox"

import { Field, FieldContent, FieldLabel } from "@/components/ui/field"

type Props<T extends FieldValues> = {
  control: Control<T>
  name: FieldPath<T>
  label: string
}

export function RHFCheckbox<T extends FieldValues>({
  control,
  name,
  label,
}: Props<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        const isChedked = field.value === "YES"
        return (
          <Field orientation="horizontal" className="rounded-lg border p-4">
            <Checkbox
              checked={isChedked}
              onCheckedChange={(checked) => {
                field.onChange(checked ? "YES" : "NO")
              }}
              className="h-5 w-5 rounded-sm transition-all duration-150"
            />

            <FieldContent>
              <FieldLabel>{label}</FieldLabel>
            </FieldContent>
          </Field>
        )
      }}
    />
  )
}
