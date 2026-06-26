import ResetPasswordForm from "./components/reset-password-form"
import { getCurrentUser } from "@/app/actions/auth"
import { redirect } from "next/navigation"

export default async function ResetPassword() {
  const user = await getCurrentUser()
  if (user) redirect("/login")
  return <ResetPasswordForm />
}
