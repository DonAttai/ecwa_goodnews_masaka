"use client"

import React from "react"
import useFellowships from "../hooks/useFellowships"
import { useFormContext } from "react-hook-form"

export const FellowshipSelector: React.FC = () => {
  const { items, loading } = useFellowships()
  const { watch, setValue } = useFormContext()
  const selected: string[] = watch("fellowships") || []

  const toggle = (id: string) => {
    const next = selected.includes(id)
      ? selected.filter((s) => s !== id)
      : [...selected, id]
    setValue("fellowships", next)
  }

  if (loading) return <div>Loading fellowships...</div>

  return (
    <div className="grid gap-2">
      {items.map((f) => (
        <label key={f.id} className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={selected.includes(f.id)}
            onChange={() => toggle(f.id)}
          />
          <span>{f.name}</span>
        </label>
      ))}
    </div>
  )
}

export default FellowshipSelector
