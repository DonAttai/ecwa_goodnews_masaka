"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import { Edit, Trash2 } from "lucide-react"
import {
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "../actions/department"

const departmentSchema = z.object({
  name: z.string().min(2, "Department name is required"),
  description: z.string().optional(),
})

type DepartmentFormValues = z.infer<typeof departmentSchema>

interface DepartmentSectionProps {
  departments: Array<{ id: string; name: string; description?: string }>
}

interface EditableDepartment {
  id: string
  name: string
  description: string
}

export default function DepartmentSection({
  departments,
}: DepartmentSectionProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingDepartment, setEditingDepartment] =
    useState<EditableDepartment | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [departmentToDelete, setDepartmentToDelete] = useState<string | null>(
    null
  )

  const form = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentSchema),
    defaultValues: { name: "", description: "" },
  })

  async function handleCreate(data: DepartmentFormValues) {
    try {
      setIsSubmitting(true)
      const formData = new FormData()
      formData.set("name", data.name)
      formData.set("description", data.description ?? "")

      const result = await createDepartment(formData)
      if (result.success) {
        toast.success(result.message)
        form.reset({ name: "", description: "" })
        router.refresh()
      } else {
        toast.error(result.message)
      }
    } catch {
      toast.error("Failed to create department")
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleSaveEdit() {
    if (!editingDepartment) return
    setIsEditing(true)
    const formData = new FormData()
    formData.set("name", editingDepartment.name)
    formData.set("description", editingDepartment.description ?? "")

    const result = await updateDepartment(editingDepartment.id, formData)
    setIsEditing(false)
    if (result.success) {
      toast.success(result.message)
      setEditingDepartment(null)
      router.refresh()
    } else {
      toast.error(result.message)
    }
  }

  async function handleDelete() {
    if (!departmentToDelete) return
    const result = await deleteDepartment(departmentToDelete)
    if (result.success) {
      toast.success(result.message)
      setDeleteDialogOpen(false)
      setDepartmentToDelete(null)
      router.refresh()
    } else {
      toast.error(result.message)
      setDeleteDialogOpen(false)
      setDepartmentToDelete(null)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle>Add Department</CardTitle>
          <CardDescription>
            Create departments for workers and members.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Department Name</label>
            <Input {...form.register("name")} placeholder="e.g. Finance" />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              {...form.register("description")}
              placeholder="Describe the department purpose"
              rows={4}
            />
          </div>

          <Button
            onClick={form.handleSubmit(handleCreate)}
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? "Creating..." : "Create Department"}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle>Existing Departments</CardTitle>
          <CardDescription>
            These departments will appear as selectable options when creating
            users.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {departments.length === 0 ? (
            <p className="py-6 text-sm text-muted-foreground">
              No departments have been created yet.
            </p>
          ) : (
            departments.map((department) => (
              <div
                key={department.id}
                className="group flex items-start justify-between rounded-2xl border p-5 hover:bg-muted/50"
              >
                <div>
                  <div className="font-medium">{department.name}</div>
                  {department.description && (
                    <div className="mt-1 text-sm text-muted-foreground">
                      {department.description}
                    </div>
                  )}
                </div>
                <div className="flex shrink-0 gap-1.5 md:opacity-0 md:transition-opacity md:group-hover:opacity-100">
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label={`Edit ${department.name}`}
                    onClick={() =>
                      setEditingDepartment({
                        id: department.id,
                        name: department.name,
                        description: department.description ?? "",
                      })
                    }
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label={`Delete ${department.name}`}
                    onClick={() => {
                      setDepartmentToDelete(department.id)
                      setDeleteDialogOpen(true)
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Edit Department Dialog */}
      <Dialog open={!!editingDepartment} onOpenChange={() => setEditingDepartment(null)}>
        <DialogContent className="mx-4 border-border bg-card text-foreground sm:mx-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              Edit Department
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Update the department details below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Department Name</label>
              <Input
                value={editingDepartment?.name ?? ""}
                onChange={(e) =>
                  setEditingDepartment((prev) =>
                    prev ? { ...prev, name: e.target.value } : prev
                  )
                }
                className="border-border bg-muted/30 text-foreground placeholder:text-muted-foreground focus:border-primary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={editingDepartment?.description ?? ""}
                onChange={(e) =>
                  setEditingDepartment((prev) =>
                    prev ? { ...prev, description: e.target.value } : prev
                  )
                }
                rows={4}
                className="border-border bg-muted/30 text-foreground placeholder:text-muted-foreground focus:border-primary"
              />
            </div>
          </div>
          <DialogFooter className="flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditingDepartment(null)}
              className="w-full border-border text-foreground hover:bg-muted sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSaveEdit}
              disabled={isEditing}
              className="btn-gold w-full sm:w-auto"
            >
              {isEditing ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="mx-4 border-border bg-card text-foreground sm:mx-auto">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">
              Delete Department?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              This action cannot be undone. The department will be permanently
              removed from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
            <AlertDialogCancel
              onClick={() => {
                setDeleteDialogOpen(false)
                setDepartmentToDelete(null)
              }}
              className="w-full border-border bg-muted/30 text-foreground hover:bg-muted sm:w-auto"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90 sm:w-auto"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
