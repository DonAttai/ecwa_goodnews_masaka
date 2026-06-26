import ForgotPasswordForm from "./components/forgot-password-form"
import { getCurrentUser } from "@/app/actions/auth"
import { redirect } from "next/navigation"

export default async function ForgotPassword() {
  const user = await getCurrentUser()
  if (user) redirect("/login")
  return <ForgotPasswordForm />
}
