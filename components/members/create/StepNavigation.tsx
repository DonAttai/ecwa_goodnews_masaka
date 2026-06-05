"use client"

import React from "react"
import { useMemberForm } from "./MemberFormProvider"
import { STEPS } from "./types"

export const StepNavigation: React.FC = () => {
  const { stepIndex, back, next, submit, step } = useMemberForm()

  const isLast = stepIndex === STEPS.length - 1

  return (
    <div className="mt-6 flex items-center justify-between">
      <div>
        <button
          type="button"
          onClick={back}
          className="rounded border px-3 py-1"
        >
          Back
        </button>
      </div>
      <div>
        {isLast ? (
          <button
            type="button"
            onClick={() => submit()}
            className="rounded bg-green-600 px-4 py-2 text-white"
          >
            Submit
          </button>
        ) : (
          <button
            type="button"
            onClick={() => next()}
            className="rounded bg-sky-600 px-4 py-2 text-white"
          >
            Next
          </button>
        )}
      </div>
    </div>
  )
}

export default StepNavigation
