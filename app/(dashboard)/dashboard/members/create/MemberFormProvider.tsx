"use client"

import React, { createContext, useContext, useMemo, useState } from "react"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { MemberFormSchema, MemberFormValues, STEPS, Step } from "./types"

type Context = {
  form: ReturnType<typeof useForm<MemberFormValues>>
  stepIndex: number
  step: Step
  next: () => Promise<boolean>
  back: () => void
  goTo: (index: number) => void
  submit: () => Promise<void>
}

const MemberFormContext = createContext<Context | null>(null)

export const useMemberForm = () => {
  const ctx = useContext(MemberFormContext)
  if (!ctx)
    throw new Error("useMemberForm must be used within MemberFormProvider")
  return ctx
}

export const MemberFormProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const methods = useForm<MemberFormValues>({
    resolver: zodResolver(MemberFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      otherNames: "",
      children: [],
      fellowships: [],
    },
    mode: "onTouched",
  })

  const [stepIndex, setStepIndex] = useState(0)

  const step = STEPS[stepIndex]

  const fieldsForStep: Record<
    Step,
    Array<keyof MemberFormValues | string>
  > = useMemo(
    () => ({
      Personal: [
        "firstName",
        "lastName",
        "otherNames",
        "dateOfBirth",
        "stateOfOrigin",
        "lgaOfOrigin",
        "married",
        "spouseName",
      ],
      Passport: ["passportUrl"],
      Family: ["children", "fellowships"],
      Spiritual: ["baptized", "baptismDate"],
      Discipline: ["discipline", "disciplineReason"],
      Recommendations: ["recommendations"],
      Declaration: [],
    }),
    []
  )

  const next = async () => {
    const keys = fieldsForStep[step]
    const ok = await methods.trigger(keys as any)
    if (!ok) {
      const firstErrorField = Object.keys(methods.formState.errors)[0]
      if (firstErrorField) {
        for (let i = 0; i < STEPS.length; i++) {
          if ((fieldsForStep[STEPS[i]] as string[]).includes(firstErrorField)) {
            setStepIndex(i)
            break
          }
        }
      }
      return false
    }
    setStepIndex((s) => Math.min(s + 1, STEPS.length - 1))
    return true
  }

  const back = () => setStepIndex((s) => Math.max(s - 1, 0))

  const goTo = (index: number) =>
    setStepIndex(Math.max(0, Math.min(index, STEPS.length - 1)))

  const submit = async () => {
    const data = await methods.handleSubmit(async (values) => {
      await fetch("/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })
    })()
    return data as any
  }

  const ctx: Context = {
    form: methods,
    stepIndex,
    step,
    next,
    back,
    goTo,
    submit,
  }

  return (
    <MemberFormContext.Provider value={ctx}>
      <FormProvider {...methods}>{children}</FormProvider>
    </MemberFormContext.Provider>
  )
}

export default MemberFormProvider
