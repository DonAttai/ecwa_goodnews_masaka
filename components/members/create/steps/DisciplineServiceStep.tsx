"use client"

import React from "react"
import ControlledRadioGroup from "../components/ControlledRadioGroup"
import ControlledTextarea from "../components/ControlledTextarea"
import { useFormContext } from "react-hook-form"

export const DisciplineServiceStep: React.FC = () => {
  const { watch } = useFormContext()
  return (
    <div>
      <ControlledRadioGroup
        name="discipline"
        label="Under discipline?"
        options={[
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" },
        ]}
      />
      {watch("discipline") === "yes" && (
        <ControlledTextarea name="disciplineReason" label="Reason" />
      )}
    </div>
  )
}

export default DisciplineServiceStep
