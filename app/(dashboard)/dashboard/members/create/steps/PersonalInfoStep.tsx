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
import { Textarea } from "@/components/ui/textarea"
import RequiredLabel from "../components/RequiredLabel"
import { nigeriaStates } from "@/lib/nigeria-locations"
import { MemberFormValues } from "../../schemas"

interface PersonalInfoStepProps {
  control: Control<MemberFormValues>
  selectedState: string
  availableLgas: string[]
  isMarried: boolean
}

export default function PersonalInfoStep({
  control,
  selectedState,
  availableLgas,
  isMarried,
}: PersonalInfoStepProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Controller
          control={control}
          name="surname"
          render={({ field, fieldState }) => (
            <Field>
              <div className="flex items-center justify-between gap-2">
                <FieldLabel>Surname</FieldLabel>
                <RequiredLabel />
              </div>
              <Input {...field} placeholder="Surname" />
              <FieldError>{fieldState.error?.message}</FieldError>
            </Field>
          )}
        />

        <Controller
          control={control}
          name="firstName"
          render={({ field, fieldState }) => (
            <Field>
              <div className="flex items-center justify-between gap-2">
                <FieldLabel>First Name</FieldLabel>
                <RequiredLabel />
              </div>
              <Input {...field} placeholder="First name" />
              <FieldError>{fieldState.error?.message}</FieldError>
            </Field>
          )}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Controller
          control={control}
          name="otherNames"
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Other Names</FieldLabel>
              <Input {...field} placeholder="Other names" />
              <FieldError>{fieldState.error?.message}</FieldError>
            </Field>
          )}
        />

        <Controller
          control={control}
          name="previousPlaceOfWorship"
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Previous Place of Worship</FieldLabel>
              <Input {...field} placeholder="Previous place of worship" />
              <FieldError>{fieldState.error?.message}</FieldError>
            </Field>
          )}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Controller
          control={control}
          name="presentAddress"
          render={({ field, fieldState }) => (
            <Field>
              <div className="flex items-center justify-between gap-2">
                <FieldLabel>Present Address</FieldLabel>
                <RequiredLabel />
              </div>
              <Textarea {...field} placeholder="Present address" rows={3} />
              <FieldError>{fieldState.error?.message}</FieldError>
            </Field>
          )}
        />

        <Controller
          control={control}
          name="phoneNumber"
          render={({ field, fieldState }) => (
            <Field>
              <div className="flex items-center justify-between gap-2">
                <FieldLabel>Phone Number</FieldLabel>
                <RequiredLabel />
              </div>
              <Input {...field} placeholder="Phone number" />
              <FieldError>{fieldState.error?.message}</FieldError>
            </Field>
          )}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Controller
          control={control}
          name="email"
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Email</FieldLabel>
              <Input {...field} placeholder="Email address" />
              <FieldError>{fieldState.error?.message}</FieldError>
            </Field>
          )}
        />

        <Controller
          control={control}
          name="homeCell"
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Home Cell</FieldLabel>
              <Input {...field} placeholder="Cell name" />
              <FieldError>{fieldState.error?.message}</FieldError>
            </Field>
          )}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Controller
          control={control}
          name="zone"
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Zone</FieldLabel>
              <Input {...field} placeholder="Zone" />
              <FieldError>{fieldState.error?.message}</FieldError>
            </Field>
          )}
        />

        <Controller
          control={control}
          name="maritalStatus"
          render={({ field, fieldState }) => (
            <Field>
              <div className="flex items-center justify-between gap-2">
                <FieldLabel>Marital Status</FieldLabel>
                <RequiredLabel />
              </div>
              <Select
                onValueChange={field.onChange}
                value={field.value || "SINGLE"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select marital status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SINGLE">Single</SelectItem>
                  <SelectItem value="MARRIED">Married</SelectItem>
                  <SelectItem value="DIVORCED">Divorced</SelectItem>
                  <SelectItem value="WIDOWED">Widowed</SelectItem>
                </SelectContent>
              </Select>
              <FieldError>{fieldState.error?.message}</FieldError>
            </Field>
          )}
        />
      </div>

      {isMarried && (
        <Controller
          control={control}
          name="spouseName"
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Spouse Name</FieldLabel>
              <Input {...field} placeholder="Spouse name" />
              <FieldError>{fieldState.error?.message}</FieldError>
            </Field>
          )}
        />
      )}

      <div className="grid gap-6 md:grid-cols-3">
        <Controller
          control={control}
          name="stateOfOrigin"
          render={({ field, fieldState }) => (
            <Field>
              <div className="flex items-center justify-between gap-2">
                <FieldLabel>State of Origin</FieldLabel>
                <RequiredLabel />
              </div>
              <Select onValueChange={field.onChange} value={field.value || ""}>
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {nigeriaStates.map((state) => (
                    <SelectItem key={state.name} value={state.name}>
                      {state.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError>{fieldState.error?.message}</FieldError>
            </Field>
          )}
        />

        <Controller
          control={control}
          name="lga"
          render={({ field, fieldState }) => (
            <Field>
              <div className="flex items-center justify-between gap-2">
                <FieldLabel>LGA</FieldLabel>
                <RequiredLabel />
              </div>
              <Select onValueChange={field.onChange} value={field.value || ""}>
                <SelectTrigger>
                  <SelectValue placeholder="Select LGA" />
                </SelectTrigger>
                <SelectContent>
                  {availableLgas.map((lga) => (
                    <SelectItem key={lga} value={lga}>
                      {lga}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError>{fieldState.error?.message}</FieldError>
            </Field>
          )}
        />

        <Controller
          control={control}
          name="tribe"
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Tribe</FieldLabel>
              <Input {...field} placeholder="Tribe" />
              <FieldError>{fieldState.error?.message}</FieldError>
            </Field>
          )}
        />
      </div>
    </div>
  )
}
