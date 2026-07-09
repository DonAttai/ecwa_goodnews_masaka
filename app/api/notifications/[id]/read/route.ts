import { NextResponse } from "next/server"
import { getCurrentUser } from "@/app/actions/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  await prisma.notification.updateMany({
    where: { id, userId: user.id },
    data: { read: true },
  })

  return NextResponse.json({ success: true })
}
