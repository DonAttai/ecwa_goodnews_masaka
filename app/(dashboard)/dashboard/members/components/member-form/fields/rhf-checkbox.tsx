import { Control, Controller, FieldPath, FieldValues } from "react-hook-form"

import { Checkbox } from "@/components/ui/checkbox"

import { Field, FieldContent, FieldLabel } from "@/components/ui/field"

type Props<T extends FieldValues> = {
  control: Control<T>
  name: FieldPath<T>
  label: string
}

const toBoolean = (value: string) => value === "YES"
const toYesNo = (value: boolean) => (value ? "YES" : "NO")

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
              className="h-5 w-5 rounded-sm border-2 border-black bg-white transition-all duration-150 focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 data-[state=checked]:border-black data-[state=checked]:bg-black data-[state=checked]:text-white"
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
