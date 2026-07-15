"use server"

import { requireAdmin } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const departmentSchema = z.object({
  name: z.string().min(2, "Department name is required"),
  description: z.string().optional(),
})

export async function createDepartment(formData: FormData) {
  try {
    await requireAdmin()

    const name = formData.get("name")?.toString().trim() ?? ""
    const description = formData.get("description")?.toString().trim() ?? ""

    const parsed = departmentSchema.safeParse({ name, description })
    if (!parsed.success) {
      return {
        success: false,
        message: parsed.error.issues[0]?.message ?? "Please check the form",
      }
    }

    await prisma.department.create({
      data: {
        name: parsed.data.name,
        description: parsed.data.description || null,
      },
    })

    revalidatePath("/dashboard/settings")
    revalidatePath("/dashboard/users")
    return { success: true, message: "Department created successfully" }
  } catch (error: any) {
    if (error?.code === "P2002") {
      return {
        success: false,
        message: "A department with that name already exists",
      }
    }
    return {
      success: false,
      message: error?.message || "Failed to create department",
    }
  }
}

export async function getDepartments() {
  await requireAdmin()

  return prisma.department.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: "asc",
    },
  })
}
