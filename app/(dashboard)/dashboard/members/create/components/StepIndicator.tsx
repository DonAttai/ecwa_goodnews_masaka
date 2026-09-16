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
  maxVisited?: number
  passportUrl: string | null
  onStepClick: (index: number) => void
}

const PASSPORT_STEP_INDEX = 4

export function StepIndicator({
  steps,
  currentStep,
  maxVisited,
  passportUrl,
  onStepClick,
}: StepIndicatorProps) {
  const visitedUpTo = maxVisited ?? currentStep
  return (
    <div className="mb-8 overflow-x-auto">
      <div className="flex min-w-max gap-2" role="list">
        {steps.map((step, idx) => {
          const Icon = step.icon
          const isActive = idx === currentStep
          const isCompleted = idx < currentStep
          const isPassportStep = idx === PASSPORT_STEP_INDEX
          const hasPassport = isPassportStep && passportUrl
          const isReachable = idx <= visitedUpTo

          const className = isActive
            ? "bg-primary text-primary-foreground shadow-md"
            : isCompleted || hasPassport
              ? "bg-green-100 text-green-700"
              : "bg-muted"

          return (
            <div
              key={idx}
              role="listitem button"
              tabIndex={isReachable && !isActive ? 0 : -1}
              aria-current={isActive ? "step" : undefined}
              aria-disabled={!isReachable}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 transition-all ${className} ${isReachable && !isActive ? "cursor-pointer hover:opacity-80" : isActive ? "" : "cursor-not-allowed opacity-60"}`}
              onClick={() => {
                if (isReachable && !isActive) {
                  onStepClick(idx)
                }
              }}
              onKeyDown={(event) => {
                if (
                  (event.key === "Enter" || event.key === " ") &&
                  isReachable &&
                  !isActive
                ) {
                  event.preventDefault()
                  onStepClick(idx)
                }
              }}
            >
              <Icon className="h-4 w-4" />
              <span className="text-sm font-medium sm:inline">{step.title}</span>
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
