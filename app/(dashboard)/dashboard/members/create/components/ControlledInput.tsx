"use client"

import React from "react"
import { useController, useFormContext } from "react-hook-form"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

type Props = React.ComponentPropsWithoutRef<typeof Input> & {
  name: string
  label?: string
  required?: boolean
}

export const ControlledInput: React.FC<Props> = ({
  name,
  label,
  required,
  ...rest
}) => {
  const { control } = useFormContext()
  const { field, fieldState } = useController({ name, control })
  return (
    <div>
      {label && (
        <Label>
          {label}
          {required ? " *" : ""}
        </Label>
      )}
      <Input {...field} {...rest} />
      {fieldState.error && (
        <div className="mt-1 text-red-600">{fieldState.error.message}</div>
      )}
    </div>
  )
}

export default ControlledInput
