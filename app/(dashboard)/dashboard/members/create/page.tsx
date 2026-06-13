import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import CreateMemberPage from "./create-member-page"

export const metadata: Metadata = {
  title: "Create New Member",
  description: "Register a new member",
}

export default async function CreateMember() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  if (session.role !== "ADMIN") {
    redirect("/dashboard/members")
  }

  return (
    <div className="space-y-6">
      {/* Header with title and back button */}
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Create New Member
          </h1>
          <p className="text-sm text-muted-foreground">
            Fill out the membership form to register a new member
          </p>
        </div>

        <Link href="/dashboard/members">
          <Button variant="outline" size="sm" className="gap-2 text-black">
            <ArrowLeft className="h-4 w-4" />
            Back to Members
          </Button>
        </Link>
      </div>

      {/* Member Form */}
      <CreateMemberPage />
    </div>
  )
}
