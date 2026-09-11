"use server"

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
export async function getAllUsers(page = 1, pageSize = 20, query = "") {
  await requireAdmin()

  const q = query.trim()
  const where = q
    ? {
        OR: [
          { name: { contains: q, mode: "insensitive" as const } },
          { email: { contains: q, mode: "insensitive" as const } },
        ],
      }
    : {}

  const [total, users] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
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
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ])

  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  return { users, total, totalPages }
}
