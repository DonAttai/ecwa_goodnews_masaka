"use client"

import React from "react"
import ControlledRadioGroup from "../components/ControlledRadioGroup"
import ControlledInput from "../components/ControlledInput"
import { useFormContext } from "react-hook-form"

export const SpiritualDataStep: React.FC = () => {
  const { watch } = useFormContext()
  return (
    <div className="grid grid-cols-1 gap-4">
      <ControlledRadioGroup
        name="baptized"
        label="Baptized?"
        options={[
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" },
        ]}
      />
      {watch("baptized") === "yes" && (
        <ControlledInput name="baptismDate" label="Baptism date" type="date" />
      )}
    </div>
  )
}

export default SpiritualDataStep
