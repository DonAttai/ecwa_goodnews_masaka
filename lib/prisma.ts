import "dotenv/config"
import { PrismaClient } from "../generated/prisma/client"
import { Role, MaritalStatus, Gender } from "../generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

// Postgres (Neon/Supabase pooled URL at runtime, DIRECT_URL for migrations).
const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error(
    "DATABASE_URL is missing. Copy .env.example to .env and set DATABASE_URL (pooled) + DIRECT_URL (migrate)."
  )
}

const adapter = new PrismaPg({ connectionString })

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient
}
export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}

export { Role, MaritalStatus, Gender }
