import { z } from "zod"

// $0 startup env validation — no external services.
// Call validateEnv() in instrumentation.ts / build so misconfig fails fast
// instead of throwing `JWT_SECRET!` at runtime.
const serverSchema = z.object({
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required").optional(),
  DIRECT_URL: z.string().min(1).optional(),
  COOKIE_NAME: z.string().min(1).default("session"),
  CLOUDINARY_API_SECRET: z.string().min(1).optional(),
  RESEND_API_KEY: z.string().min(1).optional(),
  VAPID_PRIVATE_KEY: z.string().min(1).optional(),
})

export type ServerEnv = z.infer<typeof serverSchema>

let cached: ServerEnv | null = null
let cachedKey = ""

export function validateEnv(env = process.env): ServerEnv {
  const key = `${env.JWT_SECRET ?? ""}|${env.DATABASE_URL ?? ""}|${env.DIRECT_URL ?? ""}`
  if (cached && cachedKey === key) return cached
  const parsed = serverSchema.safeParse({
    JWT_SECRET: env.JWT_SECRET,
    DATABASE_URL: env.DATABASE_URL,
    DIRECT_URL: env.DIRECT_URL,
    COOKIE_NAME: env.COOKIE_NAME,
    CLOUDINARY_API_SECRET: env.CLOUDINARY_API_SECRET,
    RESEND_API_KEY: env.RESEND_API_KEY,
    VAPID_PRIVATE_KEY: env.VAPID_PRIVATE_KEY,
  })
  if (!parsed.success) {
    const details = parsed.error.issues
      .map((i) => `${i.path.join(".")}: ${i.message}`)
      .join("; ")
    throw new Error(`Invalid environment: ${details}`)
  }
  cached = parsed.data
  cachedKey = key
  return cached
}

export function getJwtSecret(): string {
  return validateEnv().JWT_SECRET
}
