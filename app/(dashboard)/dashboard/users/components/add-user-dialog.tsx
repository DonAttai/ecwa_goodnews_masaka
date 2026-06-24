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
import { useState } from "react"

export default function AddUserDialog() {
  const [isOpen, setIsOpen] = useState(false)

  const handleClose = () => {
    setIsOpen(false)
  }
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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

        <AddUserForm onClose={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
