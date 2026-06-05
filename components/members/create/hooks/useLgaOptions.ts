"use client"

import { useMemo } from "react"
import { getLgasByState } from "@/lib/nigeria-locations"

export const useLgaOptions = (stateName?: string) => {
  const options = useMemo(() => {
    if (!stateName) return []
    return getLgasByState(stateName).map((l) => ({ label: l, value: l }))
  }, [stateName])

  return options
}

export default useLgaOptions
