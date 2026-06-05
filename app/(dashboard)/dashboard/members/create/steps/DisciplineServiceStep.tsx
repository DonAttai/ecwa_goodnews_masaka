"use client"

import * as React from "react"
import { Controller, Control } from "react-hook-form"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import RequiredLabel from "../components/RequiredLabel"
import { MemberFormValues } from "../../schemas"

interface DisciplineServiceStepProps {
  control: Control<MemberFormValues>
  hasBeenOnDiscipline: boolean
}

export default function DisciplineServiceStep({
  control,
  hasBeenOnDiscipline,
}: DisciplineServiceStepProps) {
  return (
    <div className="space-y-6">
      <Controller
        control={control}
        name="beenOnDiscipline"
        render={({ field, fieldState }) => (
          <Field>
            <div className="flex items-center justify-between gap-2">
              <FieldLabel>Been on discipline</FieldLabel>
              <RequiredLabel />
            </div>
            <Select onValueChange={field.onChange} value={field.value || "NO"}>
              <SelectTrigger>
                <SelectValue placeholder="Select option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="YES">Yes</SelectItem>
                <SelectItem value="NO">No</SelectItem>
              </SelectContent>
            </Select>
            <FieldError>{fieldState.error?.message}</FieldError>
          </Field>
        )}
      />

      {hasBeenOnDiscipline && (
        <div className="grid gap-6 md:grid-cols-2">
          <Controller
            control={control}
            name="disciplineReason"
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Discipline Reason</FieldLabel>
                <Textarea
                  {...field}
                  placeholder="Reason for discipline"
                  rows={4}
                />
                <FieldError>{fieldState.error?.message}</FieldError>
              </Field>
            )}
          />

          <div className="space-y-6">
            <Controller
              control={control}
              name="disciplineDate"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Discipline Date</FieldLabel>
                  <Input {...field} value={field.value ?? ""} type="date" />
                  <FieldError>{fieldState.error?.message}</FieldError>
                </Field>
              )}
            />

            <Controller
              control={control}
              name="disciplineReliefDate"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Relief Date</FieldLabel>
                  <Input {...field} value={field.value ?? ""} type="date" />
                  <FieldError>{fieldState.error?.message}</FieldError>
                </Field>
              )}
            />
          </div>
        </div>
      )}

      <Controller
        control={control}
        name="previousChurchPosition"
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel>Previous Church Position</FieldLabel>
            <Input {...field} placeholder="E.g. Deacon, Usher" />
            <FieldError>{fieldState.error?.message}</FieldError>
          </Field>
        )}
      />
    </div>
  )
}
