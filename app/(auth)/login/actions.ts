"use server"
import { z } from "zod"

import {
  generateToken,
  setSessionCookie,
  verifyUserCredentials,
} from "@/lib/auth"

import { prisma } from "@/lib/prisma"

// Validation schemas
const loginSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: z.string().min(1, "Password is required"),
})
export async function login(data: z.infer<typeof loginSchema>) {
  try {
    const validation = loginSchema.safeParse({ ...data })

    if (!validation.success) {
      return {
        success: false,
        message: "Invalid form inputs",
      }
    }

    const result = await verifyUserCredentials(data.email, data.password)

    if (result.status === "PASSWORD_NOT_SET") {
      return {
        success: false,
        message: "Please set your password using the link sent to your email.",
      }
    }

    if (result.status === "INVALID_CREDENTIALS") {
      return {
        success: false,
        message: "Invalid email or password",
      }
    }
    if (result.status === "ACCOUNT_NOT_ACTIVE") {
      return {
        success: false,
        message: "Your account is not active",
      }
    }

    const user = result.user
    // Generate token and set cookie
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    await setSessionCookie(token)

    // Add audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "LOGIN",
        entity: "USER",
        entityId: user.id,
        description: `${user.name} signed in`,
        metadata: {
          email: user.email,
          role: user.role,
        },
      },
    })

    return { success: true, message: "Login successful" }
  } catch (error: any) {
    return {
      success: false,
      message: error.message ?? "An unexpected error occurred",
    }
  }
}
