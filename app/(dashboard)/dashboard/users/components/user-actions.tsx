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
import { MoreHorizontal, SquarePen, Trash2 } from "lucide-react"
import { useCallback, useState } from "react"
import { User } from "../columns"
import UpdateUserForm from "./update-user-form"
import { UserFormSkeleton } from "./user-form-skeleton"
import { deleteUser } from "../actions"
import { toast } from "sonner"

export function UserActions({ user }: { user: User }) {
  const [updateOpen, setUpdateOpen] = useState(false)
  const [updateFormReady, setUpdateFormReady] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  // Stable identity so the memoized form isn't re-rendered by parent updates.
  const handleCloseUpdate = useCallback(() => {
    setUpdateFormReady(false)
    setUpdateOpen(false)
  }, [])

  // Mount the heavy form on the next frame so the opening click's task ends
  // at the lightweight shell paint instead of after the full form mount.
  const handleUpdateOpenChange = (open: boolean) => {
    setUpdateOpen(open)
    if (open) {
      requestAnimationFrame(() => setUpdateFormReady(true))
    } else {
      setUpdateFormReady(false)
    }
  }

  const handleDelete = async () => {
    try {
      const result = await deleteUser(user.id)

      // Close the delete dialog first
      setDeleteOpen(false)

      // Show success or error notification
      if (result.success) {
        toast.success("User has been successfully deleted.")
      } else {
        toast.error(result.message ?? "Failed to delete user")
      }
    } catch {
      // Handle unexpected errors
      setDeleteOpen(false)
      toast.error("An unexpected error occurred. Please try again.")
    }
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
              // Defer the dialog mount to the next frame so the menu-close
              // paint and the dialog mount don't pile into one long task.
              requestAnimationFrame(() => setUpdateOpen(true))
            }}
          >
            <SquarePen className="mr-1 h-4 w-4" />
            Edit User
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault()
              setMenuOpen(false)
              // Same deferral as above: keep menu-close and dialog mount
              // in separate frames to avoid blocking UI updates.
              requestAnimationFrame(() => setDeleteOpen(true))
            }}
            className="text-destructive"
          >
            <Trash2 className="mr-1 h-4 w-4" />
            Delete User
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Update Dialog */}
      <Dialog open={updateOpen} onOpenChange={handleUpdateOpenChange}>
        <DialogContent className="border border-border bg-background text-foreground sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>

          {updateFormReady ? (
            <UpdateUserForm user={user} onClose={handleCloseUpdate} />
          ) : (
            <UserFormSkeleton />
          )}
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
    </>
  )
}
