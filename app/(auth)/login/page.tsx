import { redirect } from "next/navigation"
import LoginForm from "./login-form"
import { getCurrentUser } from "@/app/actions/auth"

export default async function page() {
  const currentUser = await getCurrentUser()
  if (currentUser) redirect("/dashboard")

  return <LoginForm />
}
