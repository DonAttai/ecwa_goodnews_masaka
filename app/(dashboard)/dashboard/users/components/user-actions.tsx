"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, CheckCircle, XCircle } from "lucide-react"
import { useState } from "react"
import { User } from "../columns"
import UpdateUserForm from "./update-user-form"
import { deleteUser } from "../actions"

export function UserActions({ user }: { user: User }) {
  const [updateOpen, setUpdateOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  // State for notifications
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [notificationTitle, setNotificationTitle] = useState("")
  const [notificationMessage, setNotificationMessage] = useState("")
  const [notificationType, setNotificationType] = useState<"success" | "error">(
    "success"
  )

  const handleDelete = async () => {
    try {
      const result = await deleteUser(user.id)

      // Close the delete dialog first
      setDeleteOpen(false)

      // Show success or error notification
      if (result.success) {
        setNotificationTitle("Success")
        setNotificationMessage(
          result.message || "User has been successfully deleted."
        )
        setNotificationType("success")
      } else {
        setNotificationTitle("Error")
        setNotificationMessage(
          result.message || "Failed to delete user. Please try again."
        )
        setNotificationType("error")
      }
      setNotificationOpen(true)
    } catch (error) {
      // Handle unexpected errors
      setDeleteOpen(false)
      setNotificationTitle("Error")
      setNotificationMessage("An unexpected error occurred. Please try again.")
      setNotificationType("error")
      setNotificationOpen(true)
    }
  }

  const handleUpdateSuccess = (message: string) => {
    setUpdateOpen(false)
    setNotificationTitle("Success")
    setNotificationMessage(message || "User has been successfully updated.")
    setNotificationType("success")
    setNotificationOpen(true)
  }

  const handleUpdateError = (message: string) => {
    setNotificationTitle("Error")
    setNotificationMessage(
      message || "Failed to update user. Please try again."
    )
    setNotificationType("error")
    setNotificationOpen(true)
  }

  return (
    <>
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault()
              setMenuOpen(false)
              setUpdateOpen(true)
            }}
          >
            Update User
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault()
              setMenuOpen(false)
              setDeleteOpen(true)
            }}
          >
            Delete User
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Update Dialog */}
      <Dialog open={updateOpen} onOpenChange={setUpdateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update User</DialogTitle>
          </DialogHeader>

          <UpdateUserForm
            user={user}
            onClose={() => setUpdateOpen(false)}
            onSuccess={handleUpdateSuccess}
            onError={handleUpdateError}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>

            <AlertDialogDescription>
              This action cannot be undone. User data will be completely removed
              from the servers.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>

            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Notification Dialog */}
      <AlertDialog open={notificationOpen} onOpenChange={setNotificationOpen}>
        <AlertDialogContent
          className={
            notificationType === "error" ? "border-red-500" : "border-green-500"
          }
        >
          <AlertDialogHeader className="items-center">
            <div className="flex items-center gap-3">
              {/* Success/Error Icon */}
              {notificationType === "success" ? (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                  <XCircle className="h-5 w-5 text-red-600" />
                </div>
              )}

              <AlertDialogTitle
                className={
                  notificationType === "error"
                    ? "text-red-600"
                    : "text-green-600"
                }
              >
                {notificationTitle}
              </AlertDialogTitle>
            </div>

            <AlertDialogDescription className="mt-2 text-center">
              {notificationMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="mt-6">
            <AlertDialogAction
              className={
                notificationType === "success"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }
              onClick={() => {
                setNotificationOpen(false)
                // Optional: Refresh data or trigger a refetch
                // window.location.reload() // Uncomment if you want to refresh the page
              }}
            >
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
