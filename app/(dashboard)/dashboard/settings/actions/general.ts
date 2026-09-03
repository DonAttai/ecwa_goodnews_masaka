"use server"

import { requireAdmin } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { generalSchema } from "../types/general"
import { revalidatePath } from "next/cache"

export async function updateGeneralSettings(formData: FormData) {
  try {
    await requireAdmin()

    const str = (value: FormDataEntryValue | null | undefined) =>
      typeof value === "string" && value.trim() !== ""
        ? value.trim()
        : undefined

    const churchName = str(formData.get("churchName")) ?? ""
    const address = str(formData.get("address"))
    const phone = str(formData.get("phone"))
    const email = str(formData.get("email"))
    const website = str(formData.get("website"))
    const welcomeMessage = str(formData.get("welcomeMessage"))
    const logoUrl = str(formData.get("logoUrl"))

    const validationData = {
      churchName,
      address,
      phone,
      email,
      website,
      welcomeMessage,
      logoUrl,
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
          address: validatedData.address ?? null,
          phone: validatedData.phone ?? null,
          email: validatedData.email ?? null,
          website: validatedData.website ?? null,
          welcomeMessage: validatedData.welcomeMessage ?? null,
          logoUrl: validatedData.logoUrl ?? null,
        },
      })
    } else {
      await prisma.settings.update({
        where: { id: 1 },
        data: {
          churchName: validatedData.churchName,
          address: validatedData.address ?? null,
          phone: validatedData.phone ?? null,
          email: validatedData.email ?? null,
          website: validatedData.website ?? null,
          welcomeMessage: validatedData.welcomeMessage ?? null,
          logoUrl: validatedData.logoUrl ?? null,
        },
      })
    }

    revalidatePath("/dashboard/settings")
    return { success: true, message: "Settings updated successfully" }
  } catch (error) {
    console.error("ERROR: ", error)
    return { success: false, message: "Settings update failed" }
  }
}
