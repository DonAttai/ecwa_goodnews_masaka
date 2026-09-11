"use client"

import { useEffect, useState } from "react"

import { createUser } from "../actions"

import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Controller, useForm, useWatch, type Control } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createUserSchema, CreateUserSchemaType } from "../schemas"
import { toast } from "sonner"
import { memo } from "react"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"

export default function AddUserForm({
  onClose,
  departments,
}: {
  onClose: () => void
  departments: Array<{ id: string; name: string }>
}) {
  return <AddUserFormInner onClose={onClose} departments={departments} />
}

const roleDescriptions: Record<CreateUserSchemaType["role"], string> = {
  USER: "Department heads and assistants — can submit requisitions for their department",
  WORKER: "Workers have limited permissions",
  FINANCE: "Finance has limited permissions",
  EDITOR: "Editors manage website content and member registration only",
  ADMIN: "Admins have full system access",
}

// Leaf subscription so role text updates don't re-render the whole form.
function RoleDescription({
  control,
}: {
  control: Control<CreateUserSchemaType>
}) {
  const role = useWatch({ control, name: "role" })
  return (
    <FieldDescription>
      {roleDescriptions[role] ?? "Select a role"}
    </FieldDescription>
  )
}

const AddUserFormInner = memo(function AddUserFormInner({
  onClose,
  departments,
}: {
  onClose: () => void
  departments: Array<{ id: string; name: string }>
}) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<CreateUserSchemaType>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "USER",
      departmentId: undefined,
    },
  })

  const role = useWatch({ control: form.control, name: "role" })
  useEffect(() => {
    if (role === "ADMIN") {
      form.setValue("departmentId", undefined)
    }
  }, [role, form])

  const onSubmit = async (data: CreateUserSchemaType) => {
    try {
      setIsLoading(true)
      const result = await createUser(data)

      if (result.success) {
        form.reset()
        onClose()
        toast.success(result.message || "User updated successfully")
      } else {
        toast.error(result.message || "Failed to update user")
      }
    } catch {
      toast.error("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const rolesWithDepartment = ["FINANCE", "WORKER", "USER", "EDITOR"]

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      {/* NAME */}
      <Controller
        name="name"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Full Name</FieldLabel>
            <Input
              {...field}
              id={field.name}
              aria-invalid={fieldState.invalid}
              autoFocus
              autoComplete="name"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* EMAIL */}
      <Controller
        name="email"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Email</FieldLabel>
            <Input
              {...field}
              id={field.name}
              type="email"
              aria-invalid={fieldState.invalid}
              autoComplete="email"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* ROLE */}
      <div className="space-y-2">
        <Controller
          name="role"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field orientation="responsive" data-invalid={fieldState.invalid}>
              <FieldContent>
                <FieldLabel htmlFor={field.name}>Role</FieldLabel>
                <RoleDescription control={form.control} />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </FieldContent>
              <Select
                name={field.name}
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  className="min-w-30"
                >
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="item-aligned">
                  <SelectItem value="USER">User</SelectItem>
                  <SelectItem value="WORKER">Worker</SelectItem>
                  <SelectItem value="FINANCE">Finance</SelectItem>
                  <SelectItem value="EDITOR">Editor</SelectItem>
                  <SelectItem value="ADMIN">Administrator</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          )}
        />
      </div>

      {/* department */}
      {rolesWithDepartment.includes(role) && (
        <Controller
          name="departmentId"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Department</FieldLabel>

              <Select
                name={field.name}
                value={field.value ?? ""}
                onValueChange={field.onChange}
              >
                <SelectTrigger
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                >
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>

                <SelectContent position="item-aligned">
                  {departments.length === 0 ? (
                    <div className="px-3 py-2 text-sm text-muted-foreground">
                      No departments available yet
                    </div>
                  ) : (
                    departments.map((department) => (
                      <SelectItem key={department.id} value={department.id}>
                        {department.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>

              <FieldDescription>
                Department is required for workers and users.
              </FieldDescription>

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      )}

      {/* SUBMIT */}
      <Button
        type="submit"
        disabled={isLoading}
        className="h-11 w-full bg-linear-to-r from-primary to-primary/80 text-primary-foreground hover:opacity-90"
      >
        {isLoading ? "Creating..." : "Create User"}
      </Button>
    </form>
  )
})
