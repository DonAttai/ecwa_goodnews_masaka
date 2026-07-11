import "dotenv/config"
import { defineConfig, env } from "prisma/config"
import type { PrismaConfig } from "prisma/config"

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),

    // supabase
    // url: env("DIRECT_URL"),
    shadowDatabaseUrl: env("DATABASE_URL"),
  },
} satisfies PrismaConfig)
