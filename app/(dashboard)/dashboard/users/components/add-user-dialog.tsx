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

export default function AddUserDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="h-11 rounded-xl bg-linear-to-r from-indigo-600 to-blue-600 px-5 text-white hover:opacity-90">
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </DialogTrigger>

      <DialogContent className="border border-slate-800 bg-slate-950 text-white sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl">Create User</DialogTitle>

          <DialogDescription className="text-slate-400">
            Add a new administrator or worker.
          </DialogDescription>
        </DialogHeader>

        <AddUserForm />
      </DialogContent>
    </Dialog>
  )
}
