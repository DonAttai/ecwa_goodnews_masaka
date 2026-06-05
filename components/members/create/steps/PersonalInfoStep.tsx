"use client"

import React from "react"
import { useMemberForm } from "../MemberFormProvider"
import ControlledInput from "../components/ControlledInput"
import ControlledSelect from "../components/ControlledSelect"
import ControlledRadioGroup from "../components/ControlledRadioGroup"
import { nigeriaStates, getStateNames } from "@/lib/nigeria-locations"
import useLgaOptions from "../hooks/useLgaOptions"
import { useFormContext } from "react-hook-form"

export const PersonalInfoStep: React.FC = () => {
  const { form } = useMemberForm()
  const { watch } = form
  const state = watch("stateOfOrigin")
  const lgaOptions = useLgaOptions(state)

  const stateOptions = getStateNames().map((s) => ({ label: s, value: s }))

  return (
    <div>
      <div className="grid grid-cols-2 gap-4">
        <ControlledInput name="firstName" label="First name" required />
        <ControlledInput name="lastName" label="Last name" required />
        <ControlledInput name="otherNames" label="Other names" />
        <ControlledInput name="dateOfBirth" label="Date of birth" type="date" />
        <ControlledSelect
          name="stateOfOrigin"
          label="State of origin"
          options={stateOptions}
        />
        <ControlledSelect
          name="lgaOfOrigin"
          label="LGA of origin"
          options={lgaOptions}
        />
        <ControlledRadioGroup
          name="married"
          label="Married?"
          options={[
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ]}
        />
        {watch("married") === "yes" && (
          <ControlledInput name="spouseName" label="Spouse name" />
        )}
      </div>
    </div>
  )
}

export default PersonalInfoStep
