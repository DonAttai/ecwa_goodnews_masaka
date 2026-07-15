import * as z from "zod"

export const createUserSchema = z.object({
  name: z.string().min(3, "Name is Required"),
  email: z.email({ message: "Email is Required" }),
  role: z.enum(["ADMIN", "WORKER", "USER"]),
})
export const updateUserSchema = createUserSchema
  .omit({ email: true })
  .extend({
    id: z.string(),
    isActive: z.boolean(),
  })
  .partial()

export type CreateUserSchemaType = z.infer<typeof createUserSchema>

export type UpdateUserSchemaType = z.infer<typeof updateUserSchema>
