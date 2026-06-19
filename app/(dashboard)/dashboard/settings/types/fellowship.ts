import { z } from "zod"

export const fellowshipSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, "Fellowship name is required"),
  description: z.string().optional(),
})

export type FellowshipType = z.infer<typeof fellowshipSchema>
