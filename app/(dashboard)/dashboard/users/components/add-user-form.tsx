"use client"

import { useState } from "react"

import { createUser } from "../actions"

import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"

import { Label } from "@/components/ui/label"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createUserSchema, CreateUserSchemaType } from "../schemas"
import { toast } from "sonner"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"

export default function AddUserForm({ onClose }: { onClose: () => void }) {
  const [isLoading, setIsLoading] = useState(false)
  const form = useForm<CreateUserSchemaType>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "USER",
    },
  })

  const roleDescriptions = {
    ADMIN: "Admins have full system access",
    WORKER: "Workers have limited permissions",
    USER: "Users have basic access",
  }

  const onSubmit = async (data: CreateUserSchemaType) => {
    try {
      setIsLoading(true)
      const result = await createUser(data)

      if (result.success) {
        toast.success(result.message || "User updated successfully")
        onClose()
      } else {
        toast.error(result.message || "Failed to update user")
      }
    } catch (error) {
      toast.error("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

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
              aria-invalid={fieldState.invalid}
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
                <FieldDescription>
                  {roleDescriptions[field.value] ?? "Select a role"}
                </FieldDescription>
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
                  <SelectItem value="ADMIN">Administrator</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          )}
        />
      </div>

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
}
