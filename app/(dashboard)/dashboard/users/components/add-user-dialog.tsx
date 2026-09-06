"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"

import { Plus } from "lucide-react"

import AddUserForm from "./add-user-form"
import { UserFormSkeleton } from "./user-form-skeleton"
import { useState } from "react"

export default function AddUserDialog({
  departments,
}: {
  departments: Array<{ id: string; name: string }>
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [formReady, setFormReady] = useState(false)

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (open) {
      // Mount the heavy form on the next frame so this click's task ends
      // at the lightweight shell paint instead of after the full form mount.
      requestAnimationFrame(() => setFormReady(true))
    } else {
      setFormReady(false)
    }
  }

  const handleClose = () => {
    setFormReady(false)
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="btn-gold h-11 rounded-xl px-5">
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </DialogTrigger>

      <DialogContent className="border border-border bg-background text-foreground sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl">Create User</DialogTitle>

          <DialogDescription className="text-muted-foreground">
            Add a new administrator or worker.
          </DialogDescription>
        </DialogHeader>

        {formReady ? (
          <AddUserForm onClose={handleClose} departments={departments} />
        ) : (
          <UserFormSkeleton />
        )}
      </DialogContent>
    </Dialog>
  )
}
