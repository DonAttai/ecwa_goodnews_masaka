"use client"

import { useActionState, useState } from "react"

import { login, LoginState } from "@/app/actions/auth"

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

const initialState: LoginState = {
  success: false,
  errors: {},
}

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState)
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-950 via-slate-900 to-slate-800 px-4 py-8 sm:px-6 sm:py-10">
      <Card className="mx-4 w-full max-w-lg border border-slate-800 bg-slate-900/80 shadow-2xl backdrop-blur-xl sm:mx-0">
        <CardHeader className="space-y-2 px-4 pt-6 text-center sm:px-6 sm:pt-8">
          <CardTitle className="text-2xl font-bold text-white sm:text-3xl">
            ECWA Goodnews 1, Masaka
          </CardTitle>

          <CardDescription className="text-sm text-slate-400 sm:text-base">
            Church Membership Management System - Login to your account
          </CardDescription>
        </CardHeader>

        <CardContent className="px-4 pb-6 sm:px-6 sm:pb-8">
          <form action={formAction} className="space-y-5 sm:space-y-6">
            {/* GLOBAL ERROR */}
            {"_form" in state.errors && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400 sm:px-4 sm:py-3 sm:text-sm">
                {state.errors._form?.[0]}
              </div>
            )}

            {/* EMAIL */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label
                htmlFor="email"
                className="text-sm text-slate-200 sm:text-base"
              >
                Email Address
              </Label>

              <Input
                id="email"
                name="email"
                type="email"
                placeholder="admin@ecwa.com"
                className="h-10 border-slate-700 bg-slate-800 text-sm text-white placeholder:text-slate-500 focus-visible:ring-indigo-500 sm:h-12 sm:text-base"
              />

              {"email" in state.errors && (
                <p className="text-xs text-red-400 sm:text-sm">
                  {state.errors.email?.[0]}
                </p>
              )}
            </div>

            {/* PASSWORD */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label
                htmlFor="password"
                className="text-sm text-slate-200 sm:text-base"
              >
                Password
              </Label>

              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  className="h-10 border-slate-700 bg-slate-800 pr-10 text-sm text-white placeholder:text-slate-500 focus-visible:ring-indigo-500 sm:h-12 sm:text-base"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 transition-colors hover:text-slate-200"
                >
                  {showPassword ? (
                    <svg
                      className="h-4 w-4 sm:h-5 sm:w-5"
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
                      className="h-4 w-4 sm:h-5 sm:w-5"
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
                <p className="text-xs text-red-400 sm:text-sm">
                  {state.errors.password?.[0]}
                </p>
              )}
            </div>

            {/* SUBMIT BUTTON */}
            <Button
              type="submit"
              disabled={pending}
              className="h-10 w-full rounded-xl bg-linear-to-r from-indigo-600 to-blue-600 text-sm font-semibold text-white transition hover:opacity-90 sm:h-12 sm:text-base"
            >
              {pending ? "Please wait..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
