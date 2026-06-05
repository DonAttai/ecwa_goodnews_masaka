"use client"

import React from "react"
import ChildTable from "../components/ChildTable"
import FellowshipSelector from "../components/FellowshipSelector"

export const FamilyFellowshipStep: React.FC = () => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold">Children</h3>
        <ChildTable />
      </div>
      <div>
        <h3 className="font-semibold">Fellowship groups</h3>
        <FellowshipSelector />
      </div>
    </div>
  )
}

export default FamilyFellowshipStep
