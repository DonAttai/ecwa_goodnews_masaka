import { z } from "zod"

export const requisitionSchema = z.object({
  title: z
    .string()
    .min(3, "Title is required")
    .max(80, "Title cannot exceed 80 characters"),
  description: z.string().optional(),
  category: z.string().min(2, "Category is required"),
  amount: z.coerce
    .number()
    .positive("Amount must be greater than zero")
    .optional(),
  currency: z.string().default("NGN"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
  status: z.enum(["SUBMITTED", "APPROVED", "REJECTED", "COMPLETED"]).optional(),
  neededBy: z.string().optional(),
  rejectionReason: z.string().optional(),
  receiptUrl: z.string().url("Invalid receipt URL").optional().or(z.literal("")),
})

export type RequisitionType = z.infer<typeof requisitionSchema>
