"use client"

import { z } from "zod"

export const MemberFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  otherNames: z.string().optional(),
  dateOfBirth: z.string().optional(),
  stateOfOrigin: z.string().optional(),
  lgaOfOrigin: z.string().optional(),
  married: z.enum(["yes", "no"]).optional(),
  spouseName: z.string().optional(),
  baptized: z.enum(["yes", "no"]).optional(),
  baptismDate: z.string().optional(),
  discipline: z.enum(["yes", "no"]).optional(),
  disciplineReason: z.string().optional(),
  fellowships: z.array(z.string()).optional(),
  children: z.array(
    z.object({
      id: z.string().optional(),
      name: z.string().min(1, "Child name required"),
      dob: z.string().optional(),
    })
  ),
  passportUrl: z.string().optional(),
  recommendations: z.string().optional(),
  declarationConfirmed: z.boolean().refine((value) => value === true, {
    message: "You must confirm the declaration",
  }),
})

export type MemberFormValues = z.infer<typeof MemberFormSchema>

export const STEPS = [
  "Personal",
  "Passport",
  "Family",
  "Spiritual",
  "Discipline",
  "Recommendations",
  "Declaration",
] as const

export type Step = (typeof STEPS)[number]
