"use server"

import * as z from "zod"
import { resetPasswordSchema } from "./schemas"
import { prisma } from "@/lib/prisma"
import { hash } from "bcrypt"

const schema = resetPasswordSchema.safeExtend({
  token: z.string().min(1, "token is required"),
})

export async function resetPassword(data: z.infer<typeof schema>) {
  try {
    const parsedData = schema.safeParse(data)

    if (!parsedData.success) {
      return {
        success: false,
        message: "Invalid form inputs",
      }
    }

    const { email, password, token } = parsedData.data

    const user = await prisma.user.findFirst({
      where: {
        email,
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date(),
        },
      },
    })

    if (!user) {
      return {
        success: false,
        message:
          "Invalid or expired reset token. Please request a new password reset.",
      }
    }
    const hashedPassword = await hash(password, 10)

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    })
    return {
      success: true,
      message:
        "Password reset successful! You can now login with your new password.",
    }
  } catch (error) {
    return {
      success: true,
      message: "An error occured. Please try again",
    }
  }
}
