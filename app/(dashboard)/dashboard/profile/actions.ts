"use server"

import { compare, hash } from "bcrypt"
import { prisma } from "@/lib/prisma"
import { clearSessionCookie, getSession } from "@/lib/auth"
import { z } from "zod"
import { redirect } from "next/navigation"

const passwordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
})

export default async function changePassword(
  currentPassword: string,
  newPassword: string
) {
  try {
    const validated = passwordSchema.parse({
      currentPassword,
      newPassword,
    })

    const session = await getSession()

    if (!session) {
      return {
        success: false,
        message: "Unauthorized",
      }
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.userId,
      },
      select: {
        id: true,
        password: true,
      },
    })

    if (!user) {
      return {
        success: false,
        message: "User not found",
      }
    }

    const isCurrentPasswordValid = await compare(
      validated.currentPassword,
      user.password
    )

    if (!isCurrentPasswordValid) {
      return {
        success: false,
        message: "Current password is incorrect",
      }
    }

    const isSamePassword = await compare(validated.newPassword, user.password)

    if (isSamePassword) {
      return {
        success: false,
        message: "New password must be different from your current password",
      }
    }

    const hashedPassword = await hash(validated.newPassword, 10)

    await prisma.user.update({
      where: {
        id: session.userId,
      },
      data: {
        password: hashedPassword,
      },
    })
    await clearSessionCookie()
    redirect("/login")

    return {
      success: true,
      message: "Password changed successfully. Please log in again.",
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: error.issues[0].message,
      }
    }

    return {
      success: false,
      message: "Something went wrong",
    }
  }
}
