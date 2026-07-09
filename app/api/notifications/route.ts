import { NextResponse } from "next/server"
import { getCurrentUser } from "@/app/actions/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const notifications = await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: [{ read: "asc" }, { createdAt: "desc" }],
    take: 5,
  })

  return NextResponse.json({ notifications })
}
