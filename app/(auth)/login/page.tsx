import { redirect } from "next/navigation"
import LoginForm from "./login-form"
import { getSession } from "@/lib/auth"
import { Toaster } from "sonner"

export default async function page() {
  const session = await getSession()
  if (session) {
    redirect("/dashboard")
  }
  return (
    <>
      <LoginForm />
      <Toaster />
    </>
  )
}
