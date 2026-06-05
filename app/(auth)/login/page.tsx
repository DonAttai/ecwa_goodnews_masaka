import { redirect } from "next/navigation"
import LoginForm from "./login-form"
import { getSession } from "@/lib/auth"

export default async function page() {
  const session = await getSession()
  if (session) {
    redirect("/dashboard")
  }
  return (
    <div>
      <LoginForm />
    </div>
  )
}
