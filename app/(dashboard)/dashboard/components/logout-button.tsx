"use client"

import { useTransition } from "react"

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { Button } from "@/components/ui/button"

import { LogOut } from "lucide-react"

import { logout } from "@/app/actions/auth"

export default function LogoutButton() {
  const [pending, startTransition] = useTransition()

  function handleLogout() {
    startTransition(async () => {
      await logout()
    })
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-red-400 transition hover:bg-slate-800">
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </AlertDialogTrigger>

      <AlertDialogContent className="border border-slate-800 bg-slate-950 text-white">
        <AlertDialogHeader>
          <AlertDialogTitle>Logout Confirmation</AlertDialogTitle>

          <AlertDialogDescription className="text-slate-400">
            Are you sure you want to logout?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel className="border-slate-700 bg-slate-900 text-white hover:bg-slate-800 hover:text-white">
            Cancel
          </AlertDialogCancel>

          <Button
            onClick={handleLogout}
            disabled={pending}
            className="bg-red-600 hover:bg-red-700"
          >
            {pending ? "Logging out..." : "Logout"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
