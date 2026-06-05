"use server"

import { z } from "zod"
import { redirect } from "next/navigation"
import { hash } from "bcrypt"
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
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["WORKER", "ADMIN"]).default("WORKER"),
})

export type RegisterState =
  | {
      success: boolean
      errors: {
        name?: string[]
        email?: string[]
        password?: string[]
        role?: string[]
        _form?: string[]
      }
    }
  | never

export async function login(previousState: RegisterState, formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  // Validate input
  const validation = loginSchema.safeParse({ email, password })

  if (!validation.success) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors,
    }
  }

  try {
    // Verify credentials using your existing function
    const user = await verifyUserCredentials(email, password)

    if (!user) {
      return {
        success: false,
        errors: {
          _form: ["Invalid email or password"],
        },
      }
    }

    // Generate token and set cookie using your existing functions
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    await setSessionCookie(token)

    // Optional: Add audit log
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
  } catch (error) {
    console.error("Login error:", error)
    return {
      success: false,
      errors: {
        _form: ["An unexpected error occurred"],
      },
    }
  }

  // Redirect to dashboard on success
  redirect("/dashboard")
}

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

export async function updateUserStatus(userId: string, isActive: boolean) {
  await requireAdmin()

  const user = await prisma.user.update({
    where: { id: userId },
    data: { isActive },
    select: {
      id: true,
      email: true,
      isActive: true,
    },
  })

  // Optional: Add audit log
  const adminSession = await getSession()
  await prisma.auditLog.create({
    data: {
      userId: adminSession?.userId,
      action: "UPDATE_USER_STATUS",
      entity: "USER",
      entityId: userId,
      description: `User ${user.email} status changed to ${isActive ? "active" : "inactive"}`,
      metadata: {
        previousStatus: !isActive,
        newStatus: isActive,
        changedBy: adminSession?.userId,
      },
    },
  })

  return user
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

export async function updateUserRole(
  userId: string,
  newRole: "WORKER" | "ADMIN"
) {
  await requireAdmin()

  const adminSession = await getSession()

  // Prevent admin from changing their own role
  if (adminSession?.userId === userId) {
    throw new Error("Cannot change your own role")
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: { role: newRole },
    select: {
      id: true,
      email: true,
      role: true,
    },
  })

  // Add audit log
  await prisma.auditLog.create({
    data: {
      userId: adminSession?.userId!,
      action: "UPDATE_USER_ROLE",
      entity: "USER",
      entityId: userId,
      description: `Changed user ${user.email} role to ${user.role}`,
      metadata: {
        previousRole: user.role,
        newRole,
      },
    },
  })

  return user
}
