import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/app/actions/auth"

function normalizePhone(raw: string): string[] {
  const stripped = raw.replace(/[\s\-()]/g, "")
  const withPlus = /^234[789][01]\d{8}$/.test(stripped)
    ? `+${stripped}`
    : stripped
  return Array.from(
    new Set([
      raw,
      stripped,
      withPlus,
      withPlus.startsWith("+") ? withPlus.slice(1) : `+${withPlus}`,
      withPlus.replace(/^\+?234/, "0"),
    ])
  )
}

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (user.role !== "ADMIN" && user.role !== "EDITOR") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const phone = searchParams.get("phone")?.trim()

    if (!phone || phone.replace(/\D/g, "").length < 7) {
      return NextResponse.json({ match: null })
    }

    const match = await prisma.member.findFirst({
      where: { phoneNumber: { in: normalizePhone(phone) } },
      select: { id: true, firstName: true, surname: true, phoneNumber: true },
    })

    if (!match) {
      return NextResponse.json({ match: null })
    }

    return NextResponse.json({
      match: {
        id: match.id,
        name: `${match.firstName} ${match.surname}`,
      },
    })
  } catch {
    return NextResponse.json(
      { error: "Failed to check duplicates" },
      { status: 500 }
    )
  }
}
