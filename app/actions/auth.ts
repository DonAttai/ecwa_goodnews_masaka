"use server"

import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { clearSessionCookie, getSession, requireAdmin } from "@/lib/auth"

// logout action
export async function logout() {
  await clearSessionCookie()
}

// get current user
export async function getCurrentUser() {
  const session = await getSession()

  if (!session) return null

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      department: {
        select: {
          id: true,
          name: true,
        },
      },
      createdAt: true,
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
      department: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return users
}
