import * as z from "zod"
export const forgotPasswordSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
})

export type ForgotPasswordSchemaType = z.infer<typeof forgotPasswordSchema>
