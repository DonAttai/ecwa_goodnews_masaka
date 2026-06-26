import * as z from "zod"
export const resetPasswordSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
})

export type ResetPasswordSchemaType = z.infer<typeof resetPasswordSchema>
