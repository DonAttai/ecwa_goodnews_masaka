"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { DeleteConfirmationModal } from "./delete-confirmation-modal"
import { deleteMember } from "@/app/(dashboard)/dashboard/members/actions"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface DeleteButtonProps {
  memberId: string
  memberName: string
}

export function DeleteButton({ memberId, memberName }: DeleteButtonProps) {
  const router = useRouter()
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleDelete = async () => {
    startTransition(async () => {
      const result = await deleteMember(memberId)

      if (result.success) {
        toast.success(result.message)
        router.push("/dashboard/members")
        router.refresh()
      } else {
        toast.error(result.message)
      }

      setIsDeleteModalOpen(false)
    })
  }

  return (
    <>
      <Button
        variant="destructive"
        size="lg"
        onClick={() => setIsDeleteModalOpen(true)}
        disabled={isPending}
        className="gap-2 shadow-lg"
      >
        <Trash2 className="h-5 w-5" />
        {isPending ? "Deleting..." : "Delete Member"}
      </Button>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        memberName={memberName}
        isDeleting={isPending}
      />
    </>
  )
}
