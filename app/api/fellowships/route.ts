import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/app/actions/auth"

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (user.role === "USER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const fellowships = await prisma.fellowshipGroup.findMany({
      orderBy: { name: "asc" },
    })
    return NextResponse.json(fellowships)
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch fellowships" },
      { status: 500 }
    )
  }
}
