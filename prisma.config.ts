import "dotenv/config"
import { defineConfig } from "prisma/config"
const url =
  process.env.NODE_ENV === "development"
    ? process.env["DATABASE_URL"]
    : process.env["DIRECT_URL"]

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // url: process.env["DATABASE_URL"],
    url: process.env["DIRECT_URL"],
  },
})
