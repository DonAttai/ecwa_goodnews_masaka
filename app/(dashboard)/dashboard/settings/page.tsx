import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import SettingsPage from "./components/settings-page"

export default async function Settings() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  if (session.role !== "ADMIN") {
    redirect("/dashboard")
  }
  return (
    <div>
      <SettingsPage />
    </div>
  )
}
