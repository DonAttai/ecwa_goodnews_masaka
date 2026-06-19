"use server"

import { compare, hash } from "bcrypt"
import { prisma } from "@/lib/prisma"
import { clearSessionCookie, getSession } from "@/lib/auth"
import { z } from "zod"
import { redirect } from "next/navigation"

const passwordSchema = z.object({
  currentPassword: z.string().min(1).trim(),
  newPassword: z
    .string()
    .trim()
    .min(8, "Password must be at least 8 characters"),
})

type PasswordSchemaType = z.infer<typeof passwordSchema>

export default async function changePassword({
  currentPassword,
  newPassword,
}: PasswordSchemaType) {
  try {
    const session = await getSession()
    if (!session) {
      return {
        success: false,
        message: "Unauthorized",
      }
    }

    const validationData = { currentPassword, newPassword }
    const parsed = passwordSchema.safeParse(validationData)

    if (!parsed.success) {
      return {
        success: false,
        message: "Invalid input",
      }
    }

    const validatedData = parsed.data

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

    if (!user.password) {
      return {
        success: false,
        message: "Password not set for this account",
      }
    }

    const isCurrentPasswordValid = await compare(
      validatedData.currentPassword,
      user.password
    )

    if (!isCurrentPasswordValid) {
      return {
        success: false,
        message: "Current password is incorrect",
      }
    }

    const isSamePassword = await compare(
      validatedData.newPassword,
      user.password
    )

    if (isSamePassword) {
      return {
        success: false,
        message: "New password must be different from your current password",
      }
    }

    const hashedPassword = await hash(validatedData.newPassword, 10)

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
