"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import * as z from "zod"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { Eye, EyeOff, TriangleAlert } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { resetPassword } from "../actions"
import { resetPasswordSchema, ResetPasswordSchemaType } from "../schemas"
import InvalidResetLink from "./invalid-reset-link"

export default function ResetPasswordForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const form = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email: "", password: "" },
    mode: "onBlur",
  })

  const onSubmit = async (values: ResetPasswordSchemaType) => {
    if (!token) {
      toast.error("Invalid or missing reset token")
      return
    }

    try {
      setIsLoading(true)
      const result = await resetPassword({
        token,
        email: values.email,
        password: values.password,
      })

      if (result.success) {
        toast.success(result.message ?? "Password reset successful!")
        router.push("/login")
      } else {
        toast.error(result.message ?? "Password reset failed")
      }
    } catch (error) {
      toast.error("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!token) return <InvalidResetLink />

  return (
    <div className="flex min-h-screen items-center justify-center p-4 sm:p-6 md:p-8">
      <Card className="w-full max-w-sm sm:max-w-md md:max-w-lg">
        <CardHeader className="space-y-2 px-4 pt-6 text-center sm:px-6 sm:pt-8">
          <CardTitle className="text-gold text-2xl font-bold sm:text-3xl md:text-4xl">
            ECWA Goodnews 1, Masaka
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground sm:text-base">
            Create a new password for your account
          </CardDescription>
        </CardHeader>

        <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
          <form id="reset-password-form" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-5 sm:space-y-6">
              {/* EMAIL */}
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor={field.name}
                      className="text-foreground"
                    >
                      Email Address
                    </FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder="admin@ecwa.com"
                      autoComplete="email"
                      className="border-border bg-muted/30 pr-10 text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                    />
                    <FieldDescription className="text-muted-foreground">
                      Enter the email address associated with your account
                    </FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* NEW PASSWORD */}
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor={field.name}
                      className="text-foreground"
                    >
                      New Password
                    </FieldLabel>
                    <div className="relative">
                      <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        placeholder="Enter new password"
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
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                    <FieldDescription className="text-muted-foreground">
                      Must be at least 8 characters
                    </FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-3 px-4 pb-6 sm:px-6 sm:pb-8">
          <Button
            type="submit"
            form="reset-password-form"
            disabled={isLoading}
            className="btn-gold h-10 w-full rounded-xl text-sm font-semibold sm:h-12 sm:text-base"
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </Button>
          <Link
            href="/login"
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to sign in
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
