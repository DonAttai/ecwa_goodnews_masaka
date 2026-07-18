import * as z from "zod"

export const baseUserSchema = z.object({
  name: z.string().min(3, "Name is Required"),
  email: z.email({ message: "Email is Required" }),
  role: z.enum(["ADMIN", "FINANCE", "WORKER", "USER"]),
  departmentId: z.string().optional(),
})

export const createUserSchema = baseUserSchema.superRefine((data, ctx) => {
  if ((data.role === "WORKER" || data.role === "USER") && !data.departmentId) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["departmentId"],
      message: "Department is required for workers and users",
    })
  }
})

export const updateUserSchema = baseUserSchema
  .omit({ email: true })
  .extend({
    id: z.string(),
    isActive: z.boolean(),
  })
  .partial()

export type CreateUserSchemaType = z.infer<typeof createUserSchema>

export type UpdateUserSchemaType = z.infer<typeof updateUserSchema>
