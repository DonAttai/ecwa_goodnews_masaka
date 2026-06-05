"use client"

import React from "react"
import ControlledTextarea from "../components/ControlledTextarea"

export const RecommendationsStep: React.FC = () => {
  return (
    <div>
      <ControlledTextarea
        name="recommendations"
        label="Recommendations / Remarks"
      />
    </div>
  )
}

export default RecommendationsStep
