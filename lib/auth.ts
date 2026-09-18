import { compare } from "bcrypt"
import { sign, verify, SignOptions } from "jsonwebtoken"
import { cookies } from "next/headers"
import { prisma } from "./prisma"
import { getJwtSecret } from "./env"
import { getSessionMaxAgeSec } from "./session-max-age"

export { getSessionMaxAgeSec }

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
  return sign(payload, getJwtSecret(), {
    expiresIn: JWT_EXPIRES_IN,
  })
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = verify(token, getJwtSecret()) as JWTPayload
    return decoded
  } catch {
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
    // $0: derive cookie maxAge from JWT_EXPIRES_IN so env + cookie never drift.
    maxAge: getSessionMaxAgeSec(
      JWT_EXPIRES_IN as unknown as string | number
    ),
  })
}

export async function clearSessionCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

// NOTE ($0, no migration): logout clears the cookie only — the JWT stays
// cryptographically valid until 7d expiry. Instant lockout is enforced via
// the DB-truth gates below: deactivating a user (isActive=false) or changing
// their role takes effect on the very next request because every gate
// re-reads the user row instead of trusting the JWT role claim.

export async function requireAdmin() {
  const session = await getSession()
  if (!session) {
    throw new Error("Unauthorized: Admin access required")
  }
  // DB-truth: never trust the JWT role claim for authorization (it goes
  // stale after demotion). Re-read role + isActive on every call.
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, role: true, email: true, name: true, isActive: true },
  })

  if (!user || !user.isActive || user.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required")
  }

  return {
    userId: user.id,
    role: user.role,
    email: user.email,
    name: user.name,
  }
}

// Scoped content role: ADMIN + EDITOR. Editors manage website content and
// member registration only — no users, money, analytics, or requisitions.
export async function requireEditor() {
  const session = await getSession()
  if (!session) {
    throw new Error("Unauthorized: Editor access required")
  }
  // DB-truth: re-read role + isActive so demotion/deactivation applies instantly.
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, role: true, email: true, name: true, isActive: true },
  })

  if (
    !user ||
    !user.isActive ||
    (user.role !== "ADMIN" && user.role !== "EDITOR")
  ) {
    throw new Error("Unauthorized: Editor access required")
  }

  return {
    userId: user.id,
    role: user.role,
    email: user.email,
    name: user.name,
  }
}
