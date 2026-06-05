"use client"

import React from "react"
import { MemberFormProvider, useMemberForm } from "./MemberFormProvider"
import { STEPS } from "./types"
import FormProgress from "./FormProgress"
import StepNavigation from "./StepNavigation"
import PersonalInfoStep from "./steps/PersonalInfoStep"
import PassportPhotoStep from "./steps/PassportPhotoStep"
import FamilyFellowshipStep from "./steps/FamilyFellowshipStep"
import SpiritualDataStep from "./steps/SpiritualDataStep"
import DisciplineServiceStep from "./steps/DisciplineServiceStep"
import RecommendationsStep from "./steps/RecommendationsStep"
import DeclarationStep from "./steps/DeclarationStep"

const StepRenderer: React.FC = () => {
  const { stepIndex } = useMemberForm()
  switch (stepIndex) {
    case 0:
      return <PersonalInfoStep />
    case 1:
      return <PassportPhotoStep />
    case 2:
      return <FamilyFellowshipStep />
    case 3:
      return <SpiritualDataStep />
    case 4:
      return <DisciplineServiceStep />
    case 5:
      return <RecommendationsStep />
    case 6:
      return <DeclarationStep />
    default:
      return <div />
  }
}

export const CreateMemberPage: React.FC = () => {
  return (
    <MemberFormProvider>
      <div className="mx-auto max-w-3xl rounded bg-white p-4 shadow">
        <FormProgress />
        <StepRenderer />
        <StepNavigation />
      </div>
    </MemberFormProvider>
  )
}

export default CreateMemberPage
