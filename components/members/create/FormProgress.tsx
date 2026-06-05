"use client"

import React from "react"
import { useMemberForm } from "./MemberFormProvider"
import { STEPS } from "./types"

export const FormProgress: React.FC = () => {
  const { stepIndex } = useMemberForm()
  const pct = Math.round(((stepIndex + 1) / STEPS.length) * 100)
  return (
    <div className="mb-4">
      <div className="mb-1 flex justify-between text-sm">
        <div>
          Step {stepIndex + 1} of {STEPS.length}
        </div>
        <div>{pct}%</div>
      </div>
      <div className="h-2 w-full rounded bg-gray-200">
        <div style={{ width: `${pct}%` }} className="h-2 rounded bg-sky-600" />
      </div>
    </div>
  )
}

export default FormProgress
