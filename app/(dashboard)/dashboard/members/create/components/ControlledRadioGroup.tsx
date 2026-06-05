"use client"

import React from "react"
import { useController, useFormContext } from "react-hook-form"

type Option = { label: string; value: string }
type Props = {
  name: string
  options: Option[]
  label?: string
} & React.HTMLAttributes<HTMLDivElement>

export const ControlledRadioGroup: React.FC<Props> = ({
  name,
  options,
  label,
}) => {
  const { control } = useFormContext()
  const { field } = useController({ name, control })
  return (
    <div>
      {label && <div className="mb-1 font-medium">{label}</div>}
      <div className="flex gap-4">
        {options.map((o) => (
          <label key={o.value} className="flex items-center gap-2">
            <input
              type="radio"
              value={o.value}
              checked={field.value === o.value}
              onChange={() => field.onChange(o.value)}
            />
            <span>{o.label}</span>
          </label>
        ))}
      </div>
    </div>
  )
}

export default ControlledRadioGroup
