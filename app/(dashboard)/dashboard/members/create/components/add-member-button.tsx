"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function AddMemberButton() {
  const router = useRouter()

  return (
    <Button
      onClick={() => router.push("/dashboard/members/create")}
      className="btn-gold h-9 w-full rounded-lg px-3 text-sm sm:w-auto sm:rounded-xl sm:px-4 md:h-10 md:px-5"
    >
      <Plus className="mr-1 h-3 w-3 md:mr-2 md:h-4 md:w-4" />
      <span className="block sm:hidden">Add</span>
      <span className="hidden sm:block">Add Member</span>
    </Button>
  )
}
