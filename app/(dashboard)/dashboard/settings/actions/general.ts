"use server"

import { requireAdmin } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { generalSchema } from "../types/general"
import { revalidatePath } from "next/cache"

export async function updateGeneralSettings(formData: FormData) {
  try {
    await requireAdmin()
    const churchName = formData.get("churchName") as string
    const address = formData.get("address") as string
    const phone = formData.get("phone") as string
    const email = formData.get("email") as string
    const website = formData.get("website") as string
    const welcomeMessage = formData.get("welcomeMessage") as string

    const logoUrl = (formData.get("logoUrl") as string) || null

    const validationData = {
      churchName,
      address,
      phone,
      email,
      website,
      welcomeMessage,
      logoUrl: logoUrl || undefined,
    }

    const parsed = generalSchema.safeParse(validationData)

    if (!parsed.success) {
      return {
        success: false,
        fieldErrors: parsed.error.flatten().fieldErrors,
        message: "Please check the form for errors",
      }
    }
    const validatedData = parsed.data

    const settings = await prisma.settings.findUnique({ where: { id: 1 } })
    if (!settings) {
      await prisma.settings.create({
        data: {
          churchName: validatedData.churchName,
          address: validatedData.address,
          phone: validatedData.phone,
          email: validatedData.email,
          website: validatedData.website,
          welcomeMessage: validatedData.welcomeMessage,
          logoUrl: validatedData.logoUrl,
        },
      })
    } else {
      await prisma.settings.update({
        where: { id: 1 },
        data: {
          churchName: validatedData.churchName,
          address: validatedData.address,
          phone: validatedData.phone,
          email: validatedData.email,
          website: validatedData.website,
          welcomeMessage: validatedData.welcomeMessage,
          logoUrl: validatedData.logoUrl,
        },
      })
    }

    revalidatePath("/dashboard/settings")
    return { success: true, message: "update was successful" }
  } catch (error) {
    console.error("ERROR: ", error)
    return { success: false, message: "Settings update failed" }
  }
}
