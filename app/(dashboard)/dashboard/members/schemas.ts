import { z } from "zod"

export const optionalDate = () =>
  z.preprocess((val) => {
    if (val === "" || val === undefined) return null
    return val
  }, z.string().nullable())

export const memberFormSchema = z
  .object({
    // SECTION A: PERSONAL DATA
    surname: z.string().min(1, "Surname is required").max(50),
    firstName: z.string().min(1, "First name is required").max(50),
    otherNames: z.string().optional(),
    presentAddress: z.string().min(1, "Present address is required"),
    phoneNumber: z.string().min(1, "Phone number is required"),
    email: z
      .string()
      .email("Invalid email address")
      .optional()
      .or(z.literal("")),
    previousPlaceOfWorship: z.string().optional(),
    maritalStatus: z.enum([
      "SINGLE",
      "MARRIED",
      "DIVORCED",
      "WIDOWED",
      "SEPARATED",
    ]),
    spouseName: z.string().optional(),
    homeCell: z.string().optional(),
    zone: z.string().optional(),
    stateOfOrigin: z.string().min(1, "Please select your state of origin"),
    lga: z.string().min(1, "Please select your Local Government Area"),
    tribe: z.string().min(1, "Tribe is required"),
    passportUrl: z.string().optional(),

    // Children Information
    children: z
      .array(
        z.object({
          name: z.string().min(1, "Child name is required"),
          contact: z.string().optional(),
        })
      )
      .catch([]),

    // Fellowship Information
    fellowshipGroupIds: z.array(z.string()).default([]),

    // SECTION B: SPIRITUAL DATA
    acceptedChrist: z.enum(["YES", "NO"]),
    baptized: z.enum(["YES", "NO"]),
    baptismPlace: z.string().optional(),
    baptizedBy: z.string().optional(),
    communicant: z.enum(["YES", "NO"]),

    // Church Discipline Record
    beenOnDiscipline: z.enum(["YES", "NO"]),
    disciplineReason: z.string().optional(),
    disciplineDate: optionalDate(),
    disciplineReliefDate: optionalDate(),

    // Previous Church Service
    previousChurchPosition: z.string().optional(),

    // Suggestions/Recommendations
    suggestions: z.string().optional(),

    // SECTION C: DECLARATION
    memberSignature: z.string().optional(),
    memberSignedDate: optionalDate(),
    pastorSignature: z.string().optional(),
    pastorSignedDate: optionalDate(),
  })
  .superRefine((data, ctx) => {
    if (data.maritalStatus === "MARRIED" && !data.spouseName) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Spouse name is required when marital status is married",
        path: ["spouseName"],
      })
    }
    if (data.baptized === "YES" && !data.baptismPlace) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Baptism place is required when baptized",
        path: ["baptismPlace"],
      })
    }
    if (data.baptized === "YES" && !data.baptizedBy) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Baptized by is required when baptized",
        path: ["baptizedBy"],
      })
    }
    if (data.beenOnDiscipline === "YES" && !data.disciplineReason) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please state the reason for discipline",
        path: ["disciplineReason"],
      })
    }
  })

export type MemberFormValues = z.infer<typeof memberFormSchema>
