"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function AddMemberButton() {
  const router = useRouter()

  return (
    <Button
      onClick={() => router.push("/dashboard/members/create")}
      className="h-9 w-full rounded-lg bg-linear-to-r from-indigo-600 to-blue-600 px-3 text-sm text-white hover:opacity-90 sm:w-auto sm:rounded-xl sm:px-4 md:h-10 md:px-5"
    >
      <Plus className="mr-1 h-3 w-3 md:mr-2 md:h-4 md:w-4" />
      <span className="block sm:hidden">Add</span>
      <span className="hidden sm:block">Add Member</span>
    </Button>
  )
}
