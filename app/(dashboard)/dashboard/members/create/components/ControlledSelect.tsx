"use client"

import React from "react"
import { useController, useFormContext } from "react-hook-form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type Option = { label: string; value: string }
type Props = {
  name: string
  options: Option[]
  label?: string
}

export const ControlledSelect: React.FC<Props> = ({ name, options, label }) => {
  const { control } = useFormContext()
  const { field, fieldState } = useController({ name, control })

  return (
    <div>
      {label && <div className="mb-1 font-medium">{label}</div>}
      <Select
        value={field.value || ""}
        onValueChange={(v: string) => field.onChange(v)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select..." />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {fieldState.error && (
        <div className="mt-1 text-red-600">{fieldState.error.message}</div>
      )}
    </div>
  )
}

export default ControlledSelect
