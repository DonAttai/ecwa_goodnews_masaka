import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const fellowships = await prisma.fellowshipGroup.findMany({
      orderBy: { name: "asc" },
    })
    return NextResponse.json(fellowships)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch fellowships" },
      { status: 500 }
    )
  }
}
