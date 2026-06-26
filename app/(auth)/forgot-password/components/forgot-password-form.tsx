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
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { forgotPassword } from "../actions"
import { forgotPasswordSchema, ForgotPasswordSchemaType } from "../schemas"

export default function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<ForgotPasswordSchemaType>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
    mode: "onBlur",
  })

  const onSubmit = async (values: ForgotPasswordSchemaType) => {
    try {
      setIsLoading(true)
      const result = await forgotPassword({ email: values.email })

      if (result.success) {
        toast.success(
          result.message ?? "Password reset link sent to your email!"
        )
        form.reset()
      } else {
        toast.error(result.message ?? "Failed to send reset link")
      }
    } catch (error) {
      toast.error("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 sm:p-6 md:p-8">
      <Card className="w-full max-w-sm sm:max-w-md md:max-w-lg">
        <CardHeader className="space-y-2 px-4 pt-6 text-center sm:px-6 sm:pt-8">
          <CardTitle className="text-gold text-2xl font-bold sm:text-3xl md:text-4xl">
            ECWA Goodnews 1, Masaka
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground sm:text-base">
            Enter your email address and we'll send you a link to reset your
            password
          </CardDescription>
        </CardHeader>

        <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
          <form
            id="forgot-password-form"
            onSubmit={form.handleSubmit(onSubmit)}
          >
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
                      Enter the email associated with your account
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
            form="forgot-password-form"
            disabled={isLoading}
            className="btn-gold h-10 w-full rounded-xl text-sm font-semibold sm:h-12 sm:text-base"
          >
            {isLoading ? "Sending..." : "Send Reset Link"}
          </Button>

          <Link
            href="/login"
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft size={16} />
            Back to Login
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
