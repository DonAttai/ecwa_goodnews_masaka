import { verify } from "jsonwebtoken"

function getEdgeJwtSecret(): string {
  const secret = process.env.JWT_SECRET
  if (!secret || secret.length < 32) {
    // Edge-safe check without zod to keep middleware light ($0, no deps).
    throw new Error("Invalid environment: JWT_SECRET must be at least 32 characters")
  }
  return secret
}

export interface JWTPayload {
  userId: string
  email: string
  role: string
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return verify(token, getEdgeJwtSecret()) as JWTPayload
  } catch {
    return null
  }
}
