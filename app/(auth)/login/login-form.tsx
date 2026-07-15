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
import { Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { login } from "./actions"

const formSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: z.string().min(1, "Password field is required"),
})

type FormSchemaType = z.infer<typeof formSchema>

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
    mode: "onBlur",
  })

  const onSubmit = async (values: FormSchemaType) => {
    try {
      setIsLoading(true)
      const result = await login({ ...values })

      if (result.success) {
        router.push("/dashboard")
        setTimeout(() => {
          toast.success("Login successful!")
        }, 150)
      } else {
        toast.error(result.message ?? "Login failed")
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
            Church Membership Management System - Login to your account
          </CardDescription>
        </CardHeader>

        <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
          {/* Form with ID for button to reference */}
          <form id="login-form" onSubmit={form.handleSubmit(onSubmit)}>
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
                      autoComplete="off"
                      className="border-border bg-muted/30 pr-10 text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* PASSWORD */}
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor={field.name}
                      className="text-foreground"
                    >
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
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <FieldDescription className="text-muted-foreground">
                        Password must be at least 8 characters.
                      </FieldDescription>
                      <Link
                        href="/forgot-password"
                        className="text-sm text-primary transition-colors hover:text-primary/80 hover:underline"
                      >
                        Forgot Password?
                      </Link>
                    </div>
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
            form="login-form"
            disabled={isLoading}
            className="btn-gold h-10 w-full rounded-xl text-sm font-semibold sm:h-12 sm:text-base"
          >
            {isLoading ? "Please wait..." : "Login"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
