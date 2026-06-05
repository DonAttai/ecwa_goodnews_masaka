"use server"

import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { hash } from "bcrypt"

import { getSession, requireAdmin } from "@/lib/auth"
import { revalidatePath } from "next/cache"

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
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
  const password = formData.get("password") as string
  const role = (formData.get("role") as string) || "WORKER"

  // Validate input
  const validation = registerSchema.safeParse({ name, email, password, role })

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

    // Hash password
    const hashedPassword = await hash(password, 10)

    // Create user - for first user, always make them ADMIN
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role as "WORKER" | "ADMIN",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
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
