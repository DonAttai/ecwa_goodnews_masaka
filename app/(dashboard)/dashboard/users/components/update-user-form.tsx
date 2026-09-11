"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldContent,
} from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Controller, useForm, useWatch, type Control } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { memo, useEffect } from "react"
import { User } from "../columns"
import { DialogClose } from "@/components/ui/dialog"
import { updateUser } from "../actions"
import { toast } from "sonner"

// Updated schema without email
const updateUserSchema = z.object({
  id: z.string(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  role: z.enum(["USER", "WORKER", "FINANCE", "ADMIN", "EDITOR"]),
  departmentId: z.string().optional(),
  email: z.email(),
  isActive: z.boolean(),
})

type UpdateUserFormValues = z.infer<typeof updateUserSchema>

type UpdateUserFormProps = {
  user: User
  departments: Array<{ id: string; name: string }>
  onClose: () => void
}

// Leaf subscriptions so role/status text updates don't re-render the whole
// form (keeps open/close animation frames cheap).
function RoleDescription({ control }: { control: Control<UpdateUserFormValues> }) {
  const role = useWatch({ control, name: "role" })
  return (
    <FieldDescription>
      {role === "ADMIN"
        ? "Admins have full system access"
        : role === "USER"
          ? "Department heads and assistants — can submit requisitions for their department"
          : role === "EDITOR"
            ? "Editors manage website content and member registration only"
            : "Workers have limited permissions"}
    </FieldDescription>
  )
}

function StatusDescription({
  control,
}: {
  control: Control<UpdateUserFormValues>
}) {
  const isActive = useWatch({ control, name: "isActive" })
  return (
    <FieldDescription>
      {isActive
        ? "User can access the system and perform actions"
        : "User is disabled and cannot access the system"}
    </FieldDescription>
  )
}

function UpdateUserForm({ user, departments, onClose }: UpdateUserFormProps) {
  const form = useForm<UpdateUserFormValues>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      id: user.id,
      name: user.name,
      role: user.role,
      departmentId: user.department?.id,
      email: user.email,
      isActive: user.isActive,
    },
  })

  const role = useWatch({ control: form.control, name: "role" })
  const rolesWithDepartment = ["FINANCE", "WORKER", "USER", "EDITOR"]
  // Admins have no department — clear any stale value on switch, mirroring
  // the add-user form.
  useEffect(() => {
    if (role === "ADMIN") {
      form.setValue("departmentId", undefined)
    }
  }, [role, form])

  const onSubmit = async (data: UpdateUserFormValues) => {
    try {
      const result = await updateUser(data)

      if (result.success) {
        toast.success(result.message || "User updated successfully")
        onClose()
      } else {
        toast.error(result.message || "Failed to update user")
      }
    } catch (error) {
      console.error("Update error:", error)
      toast.error("An unexpected error occurred")
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup className="space-y-6">
        {/* Email Field - Display Only (Read-only) */}
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Email</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                disabled
                className="cursor-not-allowed bg-muted"
                readOnly
              />
              <FieldDescription>
                Email address cannot be changed
              </FieldDescription>
            </Field>
          )}
        />

        {/* Name Field */}
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
                autoComplete="name"
              />
            </Field>
          )}
        />

        {/* Role Field using Select */}
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

        {/* Department Field — shown for roles that require one */}
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
                      <SelectItem value="__none" disabled>
                        No departments available yet
                      </SelectItem>
                    ) : (
                      departments.map((department) => (
                        <SelectItem
                          key={department.id}
                          value={department.id}
                        >
                          {department.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        )}

        {/* Status Field - Aesthetic Switch Card */}
        <Controller
          name="isActive"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field orientation="horizontal" data-invalid={fieldState.invalid}>
              <FieldContent>
                <FieldLabel htmlFor={field.name}>Account Status</FieldLabel>
                <StatusDescription control={form.control} />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </FieldContent>
              <Switch
                id={field.name}
                name={field.name}
                checked={field.value}
                onCheckedChange={field.onChange}
                aria-invalid={fieldState.invalid}
              />
            </Field>
          )}
        />

        {/* Form Actions */}
        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            className="flex-1"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
          <DialogClose asChild>
            <Button type="button" variant="outline" className="flex-1">
              Cancel
            </Button>
          </DialogClose>
        </div>
      </FieldGroup>
    </form>
  )
}

export default memo(UpdateUserForm)
