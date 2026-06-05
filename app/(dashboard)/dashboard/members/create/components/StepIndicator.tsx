"use client"

import React from "react"
import { Badge } from "@/components/ui/badge"

interface StepItem {
  title: string
  icon: React.ElementType
  description: string
}

interface StepIndicatorProps {
  steps: StepItem[]
  currentStep: number
  passportUrl: string | null
  onStepClick: (index: number) => void
}

export function StepIndicator({
  steps,
  currentStep,
  passportUrl,
  onStepClick,
}: StepIndicatorProps) {
  return (
    <div className="mb-8 overflow-x-auto">
      <div className="flex min-w-max gap-2">
        {steps.map((step, idx) => {
          const Icon = step.icon
          const isActive = idx === currentStep
          const isCompleted = idx < currentStep
          const isPassportStep = idx === 1
          const hasPassport = isPassportStep && passportUrl

          const className = isActive
            ? "bg-primary text-primary-foreground shadow-md"
            : isCompleted || hasPassport
              ? "bg-green-100 text-green-700"
              : "bg-muted"

          return (
            <div
              key={idx}
              className={`flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 transition-all ${className} hover:opacity-80`}
              onClick={() => {
                if (idx < currentStep) {
                  onStepClick(idx)
                }
              }}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden text-sm font-medium sm:inline">
                {step.title}
              </span>
              {(isCompleted || hasPassport) && (
                <Badge variant="secondary" className="ml-1">
                  ✓
                </Badge>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
