import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
export default async function MemberPage({
  params,
}: {
  params: Promise<{ memberId: string }>
}) {
  const session = getSession()

  if (!session) {
    redirect("/login")
  }

  const memberId = (await params).memberId
  return (
    <div>
      MemberPage
      <div className="p-8 text-center">Member ID: {memberId}</div>
    </div>
  )
}
