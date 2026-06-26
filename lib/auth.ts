import { compare } from "bcrypt"
import { sign, verify, SignOptions } from "jsonwebtoken"
import { cookies } from "next/headers"
import { prisma } from "./prisma"

const JWT_SECRET = process.env.JWT_SECRET!
const JWT_EXPIRES_IN =
  (process.env.JWT_EXPIRES_IN as SignOptions["expiresIn"]) || "7d"
const COOKIE_NAME = process.env.COOKIE_NAME || "session"

export interface JWTPayload {
  userId: string
  email: string
  role: string
}

export async function verifyUserCredentials(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      password: true,
      role: true,
      isActive: true,
      name: true,
    },
  })

  // user not found OR inactive
  if (!user) {
    return { status: "INVALID_CREDENTIALS" as const }
  }

  // user exists but must set password first
  if (!user.password) {
    return { status: "PASSWORD_NOT_SET" as const }
  }

  // user account not active
  if (!user.isActive) {
    return { status: "ACCOUNT_NOT_ACTIVE" as const }
  }

  const isValid = await compare(password, user.password)

  if (!isValid) {
    return { status: "INVALID_CREDENTIALS" as const }
  }
  return {
    status: "SUCCESS" as const,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
  }
}

export function generateToken(payload: JWTPayload): string {
  return sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  })
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = verify(token, JWT_SECRET) as JWTPayload
    return decoded
  } catch (error) {
    return null
  }
}

export async function getSession(): Promise<JWTPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value

  if (!token) {
    return null
  }

  return verifyToken(token)
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}

export async function clearSessionCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

export async function requireAdmin() {
  const session = await getSession()

  if (!session || session.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required")
  }

  return session
}
