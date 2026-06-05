"use client"

import React from "react"
import { useController, useFormContext } from "react-hook-form"
import { Textarea } from "@/components/ui/textarea"

type Props = { name: string; label?: string } & React.ComponentPropsWithoutRef<
  typeof Textarea
>

export const ControlledTextarea: React.FC<Props> = ({
  name,
  label,
  ...rest
}) => {
  const { control } = useFormContext()
  const { field, fieldState } = useController({ name, control })
  return (
    <div>
      {label && <div className="mb-1 font-medium">{label}</div>}
      <Textarea {...field} {...rest} />
      {fieldState.error && (
        <div className="mt-1 text-red-600">{fieldState.error.message}</div>
      )}
    </div>
  )
}

export default ControlledTextarea
