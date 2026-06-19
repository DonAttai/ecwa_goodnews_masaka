import { z } from "zod"

export const generalSchema = z.object({
  id: z.number().optional(),
  churchName: z.string().min(5, "Church name is required"),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.email().optional(),
  website: z.string().optional(),
  logoUrl: z.string().optional(),
  welcomeMessage: z.string().optional(),
})

export type GeneralType = z.infer<typeof generalSchema>
