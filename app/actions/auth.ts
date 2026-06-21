"use server"

import { z } from "zod"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import {
  verifyUserCredentials,
  generateToken,
  setSessionCookie,
  clearSessionCookie,
  getSession,
  requireAdmin,
} from "@/lib/auth"

// Validation schemas
const loginSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: z.string().min(1, "Password is required"),
})

// login
export async function login(data: z.infer<typeof loginSchema>) {
  const validation = loginSchema.safeParse({ ...data })

  if (!validation.success) {
    return {
      success: false,
      message: "Invalid form inputs",
    }
  }

  try {
    const user = await verifyUserCredentials(data.email, data.password)
    if (user === null) {
      return {
        success: false,
        message: "Invalid email or password",
      }
    }

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
        description: `User ${user.email} logged in successfully`,
        metadata: {
          email: user.email,
          role: user.role,
        },
      },
    })

    // Redirect to dashboard on success
    return { success: true }
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "No password") {
        return {
          success: false,
          message: "Please check your email and create a password first.",
        }
      }
    }
    return {
      success: false,
      message: "An unexpected error occurred",
    }
  }
}

// logout action
export async function logout() {
  await clearSessionCookie()
  redirect("/login")
}

export async function getCurrentUser() {
  const session = await getSession()

  if (!session) {
    return null
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
    },
  })

  return user
}

export async function isAdmin() {
  const session = await getSession()
  return session?.role === "ADMIN"
}

// Admin-only user management actions
export async function getAllUsers() {
  await requireAdmin()

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return users
}

export async function deleteUser(userId: string) {
  const adminSession = await requireAdmin()

  // Get user details before deletion for audit log
  const userToDelete = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true },
  })

  // Prevent admin from deleting themselves
  if (adminSession.userId === userId) {
    throw new Error("Cannot delete your own account")
  }

  await prisma.user.delete({
    where: { id: userId },
  })

  // Add audit log
  await prisma.auditLog.create({
    data: {
      userId: adminSession.userId,
      action: "DELETE_USER",
      entity: "USER",
      entityId: userId,
      description: `Admin deleted user ${userToDelete?.email}`,
      metadata: {
        deletedUserEmail: userToDelete?.email,
        deletedBy: adminSession.userId,
        deletedByEmail: adminSession.email,
      },
    },
  })

  return { success: true }
}
