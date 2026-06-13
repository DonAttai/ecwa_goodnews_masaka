"use client"

import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"
import Link from "next/link"

interface EditButtonProps {
  memberId: string
}

export function EditButton({ memberId }: EditButtonProps) {
  return (
    <Link href={`/dashboard/members/${memberId}/edit`}>
      <Button
        variant="outline"
        size="sm"
        className="gap-2 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60"
      >
        <Edit className="h-4 w-4" />
        <span className="hidden sm:inline">Edit Member</span>
      </Button>
    </Link>
  )
}
