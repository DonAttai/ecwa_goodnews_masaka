"use client"

import React from "react"
import { useFormContext, useController } from "react-hook-form"
import { useMemberForm } from "../MemberFormProvider"

export const DeclarationStep: React.FC = () => {
  const { form } = useMemberForm()
  const { watch } = form
  const { control } = useFormContext()
  const { field, fieldState } = useController({
    name: "declarationConfirmed",
    control,
  })

  const name = `${watch("firstName") || ""} ${watch("lastName") || ""}`.trim()

  return (
    <div>
      <p>
        Please confirm that the information provided is true to the best of your
        knowledge.
      </p>
      <div className="mt-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={field.value}
            onChange={(event) => field.onChange(event.target.checked)}
          />
          I, {name || "(name)"}, confirm the above.
        </label>
        {fieldState.error && (
          <div className="mt-1 text-red-600">{fieldState.error.message}</div>
        )}
      </div>
    </div>
  )
}

export default DeclarationStep
