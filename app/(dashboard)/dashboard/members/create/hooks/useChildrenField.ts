"use client"

import { useFieldArray, useFormContext } from "react-hook-form"
import { MemberFormValues } from "../../schemas"

export const useChildrenField = () => {
  const { control } = useFormContext<MemberFormValues>()
  const fieldArray = useFieldArray({ control, name: "children" as any })
  return fieldArray
}

export default useChildrenField
