"use client"

import { useActionState, useState } from "react"

import { login, RegisterState } from "@/app/actions/auth"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Label } from "@/components/ui/label"

const initialState: RegisterState = {
  success: false,
  errors: {},
}

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState)
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-950 via-slate-900 to-slate-800 px-6 py-10">
      <Card className="w-full max-w-lg border border-slate-800 bg-slate-900/80 shadow-2xl backdrop-blur-xl">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold text-white">
            ECWA Goodnews Masaka 1, Masaka
          </CardTitle>

          <CardDescription className="text-slate-400">
            Church Membership Management System - Login to your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form action={formAction} className="space-y-6">
            {/* GLOBAL ERROR */}
            {"_form" in state.errors && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {state.errors._form?.[0]}
              </div>
            )}

            {/* EMAIL */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-200">
                Email Address
              </Label>

              <Input
                id="email"
                name="email"
                type="email"
                placeholder="admin@ecwa.com"
                className="h-12 border-slate-700 bg-slate-800 text-white placeholder:text-slate-500 focus-visible:ring-indigo-500"
              />

              {"email" in state.errors && (
                <p className="text-sm text-red-400">
                  {state.errors.email?.[0]}
                </p>
              )}
            </div>

            {/* PASSWORD */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-200">
                Password
              </Label>

              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  className="h-12 border-slate-700 bg-slate-800 pr-10 text-white placeholder:text-slate-500 focus-visible:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 transition-colors hover:text-slate-200"
                >
                  {showPassword ? (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  )}
                </button>
              </div>

              {"password" in state.errors && (
                <p className="text-sm text-red-400">
                  {state.errors.password?.[0]}
                </p>
              )}
            </div>

            {/* SUBMIT BUTTON */}
            <Button
              type="submit"
              disabled={pending}
              className="h-12 w-full rounded-xl bg-linear-to-r from-indigo-600 to-blue-600 text-base font-semibold text-white transition hover:opacity-90"
            >
              {pending ? "Please wait..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
