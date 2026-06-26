"use server"

import crypto from "crypto"
import { prisma } from "@/lib/prisma"
import { forgotPasswordSchema, ForgotPasswordSchemaType } from "./schemas"
import { sendPasswordResetEmail } from "@/lib/email/send-password-reset-email"

export async function forgotPassword(data: ForgotPasswordSchemaType) {
  try {
    const parsedData = forgotPasswordSchema.safeParse(data)

    if (!parsedData.success) {
      return {
        success: false,
        message: "Invalid form inputs",
      }
    }

    const { email } = parsedData.data

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      return {
        success: true,
        message:
          "If an account exists with this email, you will receive a password reset link.",
      }
    }

    const resetToken = crypto.randomBytes(32).toString("hex")

    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000)

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    })

    await sendPasswordResetEmail({
      email: user.email,
      name: user.name || "User",
      token: resetToken,
    })

    return {
      success: true,
      message:
        "If an account exists with this email, you will receive a password reset link.",
    }
  } catch (error) {
    return { success: false, message: "An error occured. please try again" }
  }
}
