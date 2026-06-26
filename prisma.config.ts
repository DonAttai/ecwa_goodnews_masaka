import "dotenv/config"
import { defineConfig, env } from "prisma/config"
import type { PrismaConfig } from "prisma/config"

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // supabase
    url: env("DIRECT_URL"),
    shadowDatabaseUrl: env("DATABASE_URL"),
  },
} satisfies PrismaConfig)
