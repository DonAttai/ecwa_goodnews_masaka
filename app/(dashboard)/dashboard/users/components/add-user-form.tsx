"use client"

import { useActionState, useState } from "react"

import { createUser, CreateUserState } from "../actions"

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

const initialState: CreateUserState = {
  success: false,
  errors: {},
}

export default function AddUserForm() {
  const [state, formAction, pending] = useActionState(createUser, initialState)
  const [showPassword, setShowPassword] = useState(false)

  return (
    <form action={formAction} className="space-y-5">
      {/* NAME */}
      <div className="space-y-2">
        <Label className="text-slate-200">Full Name</Label>

        <Input
          name="name"
          placeholder="John Doe"
          className="h-11 border-slate-700 bg-slate-900 text-white"
        />

        {"name" in state.errors && (
          <p className="text-sm text-red-400">{state.errors.name?.[0]}</p>
        )}
      </div>

      {/* EMAIL */}
      <div className="space-y-2">
        <Label className="text-slate-200">Email Address</Label>

        <Input
          type="email"
          name="email"
          placeholder="john@example.com"
          className="h-11 border-slate-700 bg-slate-900 text-white"
        />

        {"email" in state.errors && (
          <p className="text-sm text-red-400">{state.errors.email?.[0]}</p>
        )}
      </div>

      {/* PASSWORD */}
      <div className="space-y-2">
        <Label className="text-slate-200">Password</Label>

        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Enter password"
            className="h-11 border-slate-700 bg-slate-900 pr-10 text-white"
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
          <p className="text-sm text-red-400">{state.errors.password?.[0]}</p>
        )}
      </div>

      {/* ROLE */}
      <div className="space-y-2">
        <Label className="text-slate-200">Role</Label>

        <Select name="role" defaultValue="WORKER">
          <SelectTrigger className="h-11 border-slate-700 bg-slate-900 text-white">
            <SelectValue />
          </SelectTrigger>

          <SelectContent className="border-slate-700 bg-slate-900 text-white">
            <SelectItem value="WORKER">Worker</SelectItem>

            <SelectItem value="ADMIN">Administrator</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* SUBMIT */}
      <Button
        type="submit"
        disabled={pending}
        className="h-11 w-full bg-linear-to-r from-indigo-600 to-blue-600 text-white hover:opacity-90"
      >
        {pending ? "Creating..." : "Create User"}
      </Button>
    </form>
  )
}
