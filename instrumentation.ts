// Fail fast on bad env in production. $0 — no services, just zod validation.
// Skipped for `next lint` / local typecheck without env by catching.
export async function register() {
  if (process.env.SKIP_ENV_VALIDATION === "1") return
  try {
    const { validateEnv } = await import("@/lib/env")
    validateEnv()
  } catch (error) {
    if (process.env.NODE_ENV === "production") throw error
    console.warn(
      "[env] skipping strict validation in dev:",
      (error as Error).message
    )
  }
}
