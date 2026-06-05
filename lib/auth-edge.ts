import { verify } from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET!

export interface JWTPayload {
  userId: string
  email: string
  role: string
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return verify(token, JWT_SECRET) as JWTPayload
  } catch {
    return null
  }
}
