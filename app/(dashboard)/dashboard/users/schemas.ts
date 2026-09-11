import * as z from "zod"

export const baseUserSchema = z.object({
  name: z.string().min(3, "Name is Required"),
  email: z.email({ message: "Email is Required" }),
  role: z.enum(["ADMIN", "FINANCE", "WORKER", "USER", "EDITOR"]),
  departmentId: z.string().min(1, "Department is required for all users"),
})

export const createUserSchema = baseUserSchema

export const updateUserSchema = baseUserSchema
  .omit({ email: true })
  .extend({
    id: z.string(),
    isActive: z.boolean(),
  })
  .partial()
  .superRefine((data, ctx) => {
    if (!data.departmentId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["departmentId"],
        message: "Department is required for all users",
      })
    }
  })

export type CreateUserSchemaType = z.infer<typeof createUserSchema>

export type UpdateUserSchemaType = z.infer<typeof updateUserSchema>
