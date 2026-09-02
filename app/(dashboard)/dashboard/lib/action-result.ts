export type ActionResult<T = undefined> =
  | { success: true; message: string; data?: T }
  | {
      success: false
      message: string
      fieldErrors?: Record<string, string[]>
    }

/**
 * Wraps an unexpected server error into a standard failure result while
 * preserving the original error context in the server logs.
 */
export function toActionResultError(
  error: unknown,
  fallbackMessage: string
): ActionResult {
  if (error instanceof Error) {
    console.error(`[server-action] ${fallbackMessage}:`, {
      message: error.message,
      stack: error.stack,
    })
    return { success: false, message: error.message || fallbackMessage }
  }

  console.error(`[server-action] ${fallbackMessage}`, error)
  return { success: false, message: fallbackMessage }
}
