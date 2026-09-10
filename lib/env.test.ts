import { describe, it, expect } from "vitest"
import { validateEnv } from "@/lib/env"

describe("validateEnv", () => {
  it("accepts a valid JWT_SECRET", () => {
    const env = validateEnv({
      ...process.env,
      JWT_SECRET: "a".repeat(32),
    } as NodeJS.ProcessEnv)
    expect(env.JWT_SECRET).toBe("a".repeat(32))
  })

  it("rejects a short JWT_SECRET", () => {
    expect(() =>
      validateEnv({ ...process.env, JWT_SECRET: "short" } as NodeJS.ProcessEnv)
    ).toThrow(/JWT_SECRET/)
  })
})
