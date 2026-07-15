"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
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
import { createDepartment } from "../actions/department"

const departmentSchema = z.object({
  name: z.string().min(2, "Department name is required"),
  description: z.string().optional(),
})

type DepartmentFormValues = z.infer<typeof departmentSchema>

interface DepartmentSectionProps {
  departments: Array<{ id: string; name: string; description?: string }>
}

export default function DepartmentSection({
  departments,
}: DepartmentSectionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

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
      } else {
        toast.error(result.message)
      }
    } catch {
      toast.error("Failed to create department")
    } finally {
      setIsSubmitting(false)
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
        <CardContent className="space-y-3">
          {departments.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No departments have been created yet.
            </p>
          ) : (
            departments.map((department) => (
              <div
                key={department.id}
                className="rounded-xl border border-border bg-muted/30 p-3"
              >
                <div className="font-medium">{department.name}</div>
                {department.description && (
                  <div className="mt-1 text-sm text-muted-foreground">
                    {department.description}
                  </div>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
