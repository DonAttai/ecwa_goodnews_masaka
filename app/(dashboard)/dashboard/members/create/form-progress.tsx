"use client"

import React from "react"
import { Progress } from "@/components/ui/progress"

interface FormProgressProps {
  value: number
}

export const FormProgress: React.FC<FormProgressProps> = ({ value }) => {
  return (
    <div className="w-full rounded-full bg-muted/70 p-0.5">
      <Progress value={value} className="h-2 rounded-full" />
    </div>
  )
}

export default FormProgress
