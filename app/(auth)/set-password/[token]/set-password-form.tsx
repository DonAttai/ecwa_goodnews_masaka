"use client"

import { useRouter } from "next/navigation"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { z } from "zod"
import { useState, useTransition } from "react"
import { Eye, EyeOff } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"

const formSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type FormSchemaType = z.infer<typeof formSchema>

interface Props {
  token: string
}

export default function SetPasswordForm({ token }: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: { password: "", confirmPassword: "" },
    mode: "onBlur",
  })

  const onSubmit = async (values: FormSchemaType) => {
    try {
      setIsLoading(true)
      const res = await fetch("/api/auth/set-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: values.password }),
      })

      const data = await res.json()

      if (res.ok) {
        toast.success("Password created successfully!")
        router.push("/login")
      } else {
        toast.error(data.message || "Failed to set password")
      }
    } catch (error) {
      toast.error("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      {/* PASSWORD */}
      <Controller
        name="password"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name} className="text-foreground">
              Password
            </FieldLabel>

            <div className="relative">
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Enter your password"
                autoComplete="new-password"
                className="border-border bg-muted/30 pr-10 text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                type={showPassword ? "text" : "password"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground focus:outline-none"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <FieldDescription className="text-muted-foreground">
              Password must be at least 8 characters.
            </FieldDescription>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* CONFIRM PASSWORD */}
      <Controller
        name="confirmPassword"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name} className="text-foreground">
              Confirm Password
            </FieldLabel>

            <div className="relative">
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Confirm your password"
                autoComplete="new-password"
                className="border-border bg-muted/30 pr-10 text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                type={showConfirmPassword ? "text" : "password"}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground focus:outline-none"
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Button
        type="submit"
        className="btn-gold w-full py-5 text-base font-semibold"
        disabled={isLoading}
      >
        {isLoading ? "Creating Password..." : "Create Password"}
      </Button>
    </form>
  )
}
