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
} from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { User } from "../columns"
import { DialogClose } from "@/components/ui/dialog"
import { updateUser } from "../actions"

// Updated schema without email
const updateUserSchema = z.object({
  id: z.string(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  role: z.enum(["WORKER", "ADMIN"]),
  isActive: z.boolean(),
})

type UpdateUserFormValues = z.infer<typeof updateUserSchema>

type UpdateUserFormProps = {
  user: User
  onClose: () => void
  onSuccess: (message: string) => void
  onError: (message: string) => void
}

export default function UpdateUserForm({
  user,
  onClose,
  onSuccess,
  onError,
}: UpdateUserFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<UpdateUserFormValues>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      id: user.id,
      name: user.name,
      role: user.role,
      isActive: user.isActive,
    },
  })

  const isActive = watch("isActive")
  const role = watch("role")

  const onSubmit = async (data: UpdateUserFormValues) => {
    try {
      const result = await updateUser(data)

      if (result.success) {
        onSuccess(result.message || "User updated successfully")
      } else {
        onError(result.message || "Failed to update user")
      }
    } catch (error) {
      console.error("Update error:", error)
      onError("An unexpected error occurred")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup className="space-y-6">
        {/* Email Field - Display Only (Read-only) */}
        <Field>
          <FieldLabel htmlFor="email">Email Address</FieldLabel>
          <Input
            id="email"
            type="email"
            value={user.email}
            disabled
            className="cursor-not-allowed bg-muted"
            readOnly
          />
          <FieldDescription>Email address cannot be changed</FieldDescription>
        </Field>

        {/* Name Field */}
        <Field>
          <FieldLabel htmlFor="name">Full Name</FieldLabel>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            {...register("name")}
            aria-invalid={errors.name ? "true" : "false"}
          />
          {errors.name && (
            <FieldError errors={[errors.name[0].message || "Invalid input"]} />
          )}
        </Field>

        {/* Role Field using Select */}
        <Field>
          <FieldLabel htmlFor="role">Role</FieldLabel>
          <Select
            value={role}
            onValueChange={(value) =>
              setValue("role", value as "WORKER" | "ADMIN")
            }
          >
            <SelectTrigger
              id="role"
              aria-invalid={errors.role ? "true" : "false"}
            >
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="WORKER">Worker</SelectItem>
              <SelectItem value="ADMIN">Administrator</SelectItem>
            </SelectContent>
          </Select>
          <FieldDescription>
            {role === "ADMIN"
              ? "Admins have full system access"
              : "Workers have limited permissions"}
          </FieldDescription>
          {errors.role && (
            <FieldError errors={[errors.role.message || "Invalid input"]} />
          )}
        </Field>

        {/* Status Field - Aesthetic Switch Card */}
        <Field
          orientation="horizontal"
          className="rounded-lg border p-4 data-invalid:border-destructive"
          data-invalid={errors.isActive ? true : undefined}
        >
          <div className="flex-1 space-y-0.5">
            <FieldLabel className="text-base">Account Status</FieldLabel>
            <FieldDescription>
              {isActive
                ? "User can access the system and perform actions"
                : "User is disabled and cannot access the system"}
            </FieldDescription>
            {errors.isActive && (
              <FieldError
                errors={[errors.isActive.message || "Invalid input"]}
              />
            )}
          </div>
          <div className="ml-4">
            <Switch
              id="isActive"
              checked={isActive}
              onCheckedChange={(checked) => setValue("isActive", checked)}
              className="data-[state=checked]:bg-green-500"
            />
          </div>
        </Field>

        {/* Form Actions */}
        <div className="flex gap-3 pt-4">
          <Button type="submit" className="flex-1" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
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
