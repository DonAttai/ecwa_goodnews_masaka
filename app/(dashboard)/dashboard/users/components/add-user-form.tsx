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
