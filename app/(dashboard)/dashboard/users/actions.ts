"use server"

import { prisma } from "@/lib/prisma"

import { requireAdmin } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { generateUserToken } from "@/lib/generate-token"
import { sendAccountCreatedEmail } from "@/lib/email/send-account-created-email"
import {
  createUserSchema,
  CreateUserSchemaType,
  updateUserSchema,
  UpdateUserSchemaType,
} from "./schemas"

export async function createUser(data: CreateUserSchemaType) {
  try {
    const admin = await requireAdmin()

    // Validate input
    const validationData = createUserSchema.safeParse({ ...data })

    if (!validationData.success) {
      return {
        success: false,
        message: "Invalid form inputs",
      }
    }

    const { email, name, role } = validationData.data

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return {
        success: false,
        message: "User with this email already exists",
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

    // Add audit log
    await prisma.auditLog.create({
      data: {
        userId: admin?.userId,
        action: "CREATE_USER",
        entity: "USER",
        entityId: user.id,
        description: `${admin.name} created user ${user.name}`,
        metadata: {
          createdBy: admin?.userId,
          createdByEmail: admin?.email,
          newUserEmail: user.email,
          newUserRole: user.role,
        },
      },
    })

    revalidatePath("/dashboard/users")
    return { success: true, message: "User creation successs" }
  } catch (error) {
    return {
      success: false,
      message: "An unexpected error occurred",
    }
  }
}

// update user
export async function updateUser(data: UpdateUserSchemaType) {
  try {
    const admin = await requireAdmin()
    const validationData = updateUserSchema.safeParse(data)

    if (!validationData.success) {
      return {
        success: false,
        message: "Invalid form inputs",
      }
    }

    // Prevent admin from changing their own role
    if (admin?.userId === data.id) {
      return {
        success: false,
        message: "Cannot update your own data",
      }
    }
    const { name, role, isActive } = validationData.data
    const user = await prisma.user.update({
      where: { id: data.id },
      data: { name, role, isActive },
      select: {
        id: true,
        email: true,
        role: true,
        name: true,
      },
    })

    // Add audit log
    await prisma.auditLog.create({
      data: {
        userId: admin?.userId!,
        action: "UPDATE_USER",
        entity: "USER",
        entityId: data.id,
        description: `${admin.name} updated ${user.name}'s profile`,
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
    const admin = await requireAdmin()

    // Get user details before deletion for audit log
    const userToDelete = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, name: true },
    })

    // Prevent admin from deleting themselves
    if (admin.userId === userId) {
      throw new Error("Cannot delete your own account")
    }

    await prisma.user.delete({
      where: { id: userId },
    })

    // Add audit log
    await prisma.auditLog.create({
      data: {
        userId: admin.userId,
        action: "DELETE_USER",
        entity: "USER",
        entityId: userId,
        description: `${admin.name} deleted ${userToDelete?.name}`,
        metadata: {
          deletedUserEmail: userToDelete?.email,
          deletedBy: admin.userId,
          deletedByEmail: admin.email,
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
