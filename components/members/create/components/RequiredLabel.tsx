"use client"

import React from "react"

export const RequiredLabel: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <label className="font-medium">
    {children} <span className="text-red-600">*</span>
  </label>
)

export default RequiredLabel
