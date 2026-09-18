"use server"
import { z } from "zod"

import {
  generateToken,
  setSessionCookie,
  verifyUserCredentials,
} from "@/lib/auth"

import { prisma } from "@/lib/prisma"
import { getClientIp, rateLimit } from "@/lib/rate-limit"

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

    const clientIp = await getClientIp()
    const throttled = rateLimit({
      key: `login:${data.email.toLowerCase()}:${clientIp}`,
      limit: 10,
      windowMs: 60 * 60 * 1000,
    })

    if (!throttled.ok) {
      return {
        success: false,
        message: "Too many login attempts. Please try again later.",
      }
    }

    const result = await verifyUserCredentials(data.email, data.password)

    if (result.status === "PASSWORD_NOT_SET") {
      // Best-effort failed-login trail reusing existing LOGIN enum ($0, no migration).
      await prisma.auditLog
        .create({
          data: {
            userId: null,
            action: "LOGIN",
            entity: "USER",
            entityId: null,
            description: `Password-not-set login attempt for ${data.email.toLowerCase()}`,
            metadata: { email: data.email.toLowerCase(), success: false },
          },
        })
        .catch(() => {})
      return {
        success: false,
        message: "Please set your password using the link sent to your email.",
      }
    }

    if (result.status === "INVALID_CREDENTIALS") {
      await prisma.auditLog
        .create({
          data: {
            userId: null,
            action: "LOGIN",
            entity: "USER",
            entityId: null,
            description: `Failed login attempt for ${data.email.toLowerCase()}`,
            metadata: { email: data.email.toLowerCase(), success: false },
          },
        })
        .catch(() => {})
      return {
        success: false,
        message: "Invalid email or password",
      }
    }
    if (result.status === "ACCOUNT_NOT_ACTIVE") {
      await prisma.auditLog
        .create({
          data: {
            userId: null,
            action: "LOGIN",
            entity: "USER",
            entityId: null,
            description: `Inactive-account login attempt for ${data.email.toLowerCase()}`,
            metadata: { email: data.email.toLowerCase(), success: false },
          },
        })
        .catch(() => {})
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

    // Add audit log (best-effort — must never fail the login).
    await prisma.auditLog
      .create({
        data: {
          userId: user.id,
          action: "LOGIN",
          entity: "USER",
          entityId: user.id,
          description: `${user.name} signed in`,
          metadata: {
            email: user.email,
            role: user.role,
            success: true,
          },
        },
      })
      .catch((auditError) => {
        console.error("[auth] Failed to write login audit", { auditError })
      })

    return { success: true, message: "Login successful" }
  } catch (error: unknown) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unexpected error occurred",
    }
  }
}
