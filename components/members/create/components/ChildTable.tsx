"use client"

import React from "react"
import useChildrenField from "../hooks/useChildrenField"
import { useFormContext } from "react-hook-form"

export const ChildTable: React.FC = () => {
  const { fields, append, remove, update } = useChildrenField()
  const { register } = useFormContext()

  return (
    <div>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="text-left">Name</th>
            <th className="text-left">DOB</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {fields.map((f, idx) => (
            <tr key={f.id} className="border-t">
              <td>
                <input
                  {...register(`children.${idx}.name` as const)}
                  defaultValue={(f as any).name ?? ""}
                />
              </td>
              <td>
                <input
                  type="date"
                  {...register(`children.${idx}.dob` as const)}
                  defaultValue={(f as any).dob ?? ""}
                />
              </td>
              <td>
                <button
                  type="button"
                  onClick={() => remove(idx)}
                  className="text-red-600"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-2">
        <button
          type="button"
          onClick={() => append({ name: "", dob: "" })}
          className="rounded bg-sky-600 px-3 py-1 text-white"
        >
          Add child
        </button>
      </div>
    </div>
  )
}

export default ChildTable
