"use client"

import * as React from "react"
import { Controller, Control } from "react-hook-form"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import RequiredLabel from "../components/RequiredLabel"
import { MemberFormValues } from "../../schemas"

interface SpiritualDataStepProps {
  control: Control<MemberFormValues>
  isBaptized: boolean
}

export default function SpiritualDataStep({
  control,
  isBaptized,
}: SpiritualDataStepProps) {
  return (
    <div className="space-y-6">
      <Controller
        control={control}
        name="acceptedChrist"
        render={({ field, fieldState }) => (
          <Field>
            <div className="flex items-center justify-between gap-2">
              <FieldLabel>Accepted Christ</FieldLabel>
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

      <Controller
        control={control}
        name="baptized"
        render={({ field, fieldState }) => (
          <Field>
            <div className="flex items-center justify-between gap-2">
              <FieldLabel>Baptized</FieldLabel>
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

      {isBaptized && (
        <div className="grid gap-6 md:grid-cols-2">
          <Controller
            control={control}
            name="baptismPlace"
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Baptism Place</FieldLabel>
                <Input {...field} placeholder="Baptism place" />
                <FieldError>{fieldState.error?.message}</FieldError>
              </Field>
            )}
          />

          <Controller
            control={control}
            name="baptizedBy"
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Baptized By</FieldLabel>
                <Input {...field} placeholder="Pastor or minister" />
                <FieldError>{fieldState.error?.message}</FieldError>
              </Field>
            )}
          />
        </div>
      )}

      <Controller
        control={control}
        name="communicant"
        render={({ field, fieldState }) => (
          <Field>
            <div className="flex items-center justify-between gap-2">
              <FieldLabel>Communicant</FieldLabel>
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
    </div>
  )
}
