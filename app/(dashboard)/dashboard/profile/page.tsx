import ProfileClient from "./profile-client"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/app/actions/auth"

export default async function ProfilePage() {
  const currentUser = await getCurrentUser()

  if (currentUser === null) redirect("/login")

  return <ProfileClient user={currentUser} />
}
