"use server"

import { requireAdmin } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { fellowshipSchema } from "../types/fellowship"

export async function createFellowship(formData: FormData) {
  try {
    await requireAdmin()
    const name = formData.get("name") as string
    const description = formData.get("description") as string

    const validationData = {
      name,
      description,
    }
    const parsed = fellowshipSchema.safeParse(validationData)

    if (!parsed.success) {
      return {
        success: false,
        fieldErrors: parsed.error.flatten().fieldErrors,
        message: "Please check the form for errors",
      }
    }

    const validatedData = parsed.data

    await prisma.fellowshipGroup.create({
      data: {
        name: validatedData.name,
        description: validatedData.description || null,
      },
    })

    revalidatePath("/dashboard/settings")
    return { success: true, message: "Fellowship added successfully" }
  } catch (error: any) {
    if (error.code === "P2002") {
      throw new Error("A fellowship with this name already exists.")
    }
    throw new Error("Failed to create fellowship")
  }
}

export async function updateFellowship(id: string, formData: FormData) {
  try {
    await requireAdmin()
    const name = formData.get("name") as string
    const description = formData.get("description") as string

    const validationData = {
      name,
      description,
    }

    const parsed = fellowshipSchema.safeParse(validationData)

    if (!parsed.success) {
      return {
        success: false,
        fieldErrors: parsed.error.flatten().fieldErrors,
        message: "Please check the form for errors",
      }
    }

    const validatedData = parsed.data

    await prisma.fellowshipGroup.update({
      where: { id },
      data: {
        name: validatedData.name,
        description: validatedData.description || null,
      },
    })

    revalidatePath("/dashboard/settings")
    return { success: true, message: "Fellowship updated successfully" }
  } catch (error) {
    return { success: false, message: "Failde to update fellowship" }
  }
}

export async function deleteFellowship(id: string) {
  try {
    await requireAdmin()
    await prisma.fellowshipGroup.delete({ where: { id } })
    revalidatePath("/dashboard/settings")
    return { success: true, message: "Fellowship deleted successfully" }
  } catch (error) {
    return { success: false, message: "Failde to update fellowship" }
  }
}
