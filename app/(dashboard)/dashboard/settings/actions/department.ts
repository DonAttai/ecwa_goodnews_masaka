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
  } catch (error: unknown) {
    const err = error as { code?: string; message?: string }
    if (err.code === "P2002") {
      return {
        success: false,
        message: "A department with that name already exists",
      }
    }
    return {
      success: false,
      message: err.message || "Failed to create department",
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

export async function updateDepartment(id: string, formData: FormData) {
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

    await prisma.department.update({
      where: { id },
      data: {
        name: parsed.data.name,
        description: parsed.data.description || null,
      },
    })

    revalidatePath("/dashboard/settings")
    revalidatePath("/dashboard/users")
    return { success: true, message: "Department updated successfully" }
  } catch (error: unknown) {
    const err = error as { code?: string; message?: string }
    if (err.code === "P2002") {
      return {
        success: false,
        message: "A department with that name already exists",
      }
    }
    return {
      success: false,
      message: err.message || "Failed to update department",
    }
  }
}

export async function deleteDepartment(id: string) {
  try {
    await requireAdmin()

    await prisma.department.delete({ where: { id } })

    revalidatePath("/dashboard/settings")
    revalidatePath("/dashboard/users")
    return { success: true, message: "Department deleted successfully" }
  } catch (error: unknown) {
    const err = error as { code?: string; message?: string }
    if (err.code === "P2003") {
      return {
        success: false,
        message:
          "This department is in use and cannot be deleted. Remove or reassign its users first.",
      }
    }
    return {
      success: false,
      message: err.message || "Failed to delete department",
    }
  }
}
