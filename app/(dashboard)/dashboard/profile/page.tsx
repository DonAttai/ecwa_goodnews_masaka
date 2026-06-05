import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import ProfileClient from "./profile-client"
import { redirect } from "next/navigation"

export default async function ProfilePage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  })

  if (!user) {
    return <div className="p-8 text-center">User not found</div>
  }

  return <ProfileClient user={user} />
}
