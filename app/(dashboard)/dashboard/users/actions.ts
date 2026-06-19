"use server"

import { z } from "zod"
import { prisma } from "@/lib/prisma"

import { getSession, requireAdmin } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { User } from "./columns"
import { generateUserToken } from "@/lib/generate-token"
import { sendAccountCreatedEmail } from "@/lib/email/send-account-created-email"

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["WORKER", "ADMIN"]).default("WORKER"),
})

export type CreateUserState =
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

export async function createUser(
  previousState: CreateUserState,
  formData: FormData
): Promise<CreateUserState> {
  await requireAdmin()

  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const role = (formData.get("role") as string) || "WORKER"

  // Validate input
  const validation = registerSchema.safeParse({ name, email, role })

  if (!validation.success) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors,
    }
  }

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return {
        success: false,
        errors: {
          email: ["User with this email already exists"],
        },
      }
    }

    // Create user - for first user, always make them ADMIN
    const user = await prisma.user.create({
      data: {
        name,
        email,
        role: role as "WORKER" | "ADMIN",
        password: null,
        mustChangePassword: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        mustChangePassword: true,
      },
    })

    const token = generateUserToken()

    await prisma.passwordSetupToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      },
    })

    const setupLink =
      `${process.env.NEXT_PUBLIC_APP_URL}` + `/set-password/${token}`

    await sendAccountCreatedEmail({
      email,
      name,
      setupLink,
    })

    // Get current admin session for audit log
    const adminSession = await getSession()

    // Add audit log
    await prisma.auditLog.create({
      data: {
        userId: adminSession?.userId,
        action: "CREATE_USER",
        entity: "USER",
        entityId: user.id,
        description: `Admin created user ${user.email} with role ${user.role}`,
        metadata: {
          createdBy: adminSession?.userId,
          createdByEmail: adminSession?.email,
          newUserEmail: user.email,
          newUserRole: user.role,
        },
      },
    })

    revalidatePath("/dashboard/users")

    return { success: true, errors: {} }
  } catch (error) {
    console.error("Registration error:", error)
    return {
      success: false,
      errors: {
        _form: ["An unexpected error occurred"],
      },
    }
  }
}

// update user
export async function updateUser(data: Omit<User, "email">) {
  try {
    await requireAdmin()

    const adminSession = await getSession()

    // Prevent admin from changing their own role
    if (adminSession?.userId === data.id) {
      throw new Error("Cannot change your own role")
    }

    const user = await prisma.user.update({
      where: { id: data.id },
      data: { name: data.name, role: data.role, isActive: data.isActive },
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
        entityId: data.id,
        description: `Changed user ${user.email} role to ${user.role}`,
        metadata: {
          previousRole: user.role,
          ...data,
        },
      },
    })
    revalidatePath("/dashboard/users")
    return {
      success: true,
      message: "User updated successfully",
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update user",
    }
  }
}

// delete user
export async function deleteUser(userId: string) {
  try {
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

    revalidatePath("/dashboard/users")
    return { success: true, message: "User deleted successfully" }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to delete user",
    }
  }
}
