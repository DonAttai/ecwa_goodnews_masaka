// $0 pure helper (no Next.js/Prisma imports) so vitest stays hermetic.
export function getSessionMaxAgeSec(expiresIn: string | number = "7d"): number {
  const DEFAULT_7D = 60 * 60 * 24 * 7
  if (typeof expiresIn === "number" && Number.isFinite(expiresIn)) {
    return expiresIn > 0 ? Math.floor(expiresIn) : DEFAULT_7D
  }
  const match = String(expiresIn)
    .trim()
    .match(/^(\d+)\s*([smhd])?$/i)
  if (!match) return DEFAULT_7D
  const value = Number(match[1])
  const unit = (match[2] ?? "s").toLowerCase()
  const multiplier =
    unit === "d" ? 86400 : unit === "h" ? 3600 : unit === "m" ? 60 : 1
  return value > 0 ? value * multiplier : DEFAULT_7D
}
