"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function AddMemberButton() {
  const router = useRouter()

  return (
    <Button
      onClick={() => router.push("/dashboard/members/create")}
      className="h-11 rounded-xl bg-linear-to-r from-indigo-600 to-blue-600 px-5 text-white hover:opacity-90"
    >
      <Plus className="mr-2 h-4 w-4" />
      Add Member
    </Button>
  )
}
