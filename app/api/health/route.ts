import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// $0 health check for Vercel monitoring / uptime pings. Public on purpose
// (added to PUBLIC_PATHS in proxy.ts). No auth, no PII, cached never.
export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`
    return NextResponse.json(
      { status: "ok", time: new Date().toISOString() },
      { headers: { "Cache-Control": "no-store" } }
    )
  } catch {
    return NextResponse.json({ status: "error" }, { status: 503 })
  }
}
