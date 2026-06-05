"use client"

import React from "react"

export const RequiredLabel: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => (
  <span className="font-medium text-slate-700">
    {children ?? "Required"} <span className="text-red-600">*</span>
  </span>
)

export default RequiredLabel
