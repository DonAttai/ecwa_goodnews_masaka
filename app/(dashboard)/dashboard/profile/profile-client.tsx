"use client"
import { useState } from "react"
import { Label } from "@/components/ui/label"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  KeyRound,
  Mail,
  User as UserIcon,
  Lock,
  Building2,
  BellRing,
} from "lucide-react"
import changePassword from "./actions"
import { toast } from "sonner"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import ChangePasswordDialog from "./components/change-password-dialog"
import PushToggle from "./components/push-toggle"
import { PageHeader } from "@/components/ui/page-header"
import { StatusBadge } from "@/components/ui/status-badge"

interface User {
  id: string
  name: string | null
  email: string
  role: string
  isActive: boolean
  createdAt: Date
  department: {
    id: string
    name: string
  } | null
}

const changePasswordSchema = z.object({
  newPassword: z.string().min(8, "Field is required"),
  currentPassword: z.string(),
})

export type ChangePassworSchemaType = z.infer<typeof changePasswordSchema>

export default function ProfileClient({ user }: { user: User }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)

  const userData = [
    { label: "Full Name", value: user.name || "Not provided" },

    {
      label: "Department",
      value: user.department?.name ?? "N/A",
      icon: Building2,
    },

    {
      label: "Role",
      value: user.role,
      badge: true,
    },

    {
      label: "Added On",
      value: new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(user.createdAt),
    },
  ]

  const getInitials = (name: string | null) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const form = useForm<ChangePassworSchemaType>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "" },
    mode: "onBlur",
  })

  const handleChangePassword = async (
    data: ChangePassworSchemaType
  ): Promise<void> => {
    try {
      setIsLoading(true)
      // Close optimistically: success redirects to /login (full navigation),
      // so start the exit animation now instead of snapping mid-dialog.
      setIsOpen(false)
      const result = await changePassword(data)
      if (!result.success) {
        // Reopen so the user can correct and retry.
        setIsOpen(true)
        toast.error(result.message ?? "Request to change password failed")
        return
      }

      form.reset({ currentPassword: "", newPassword: "" })
      toast.success("Login with your new password")
    } catch {
      // Reopen so the user can retry.
      setIsOpen(true)
      toast.error("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Account"
        title="My Profile"
        description="Manage your account settings and preferences"
        actions={
          <StatusBadge status={user.isActive ? "ACTIVE" : "INACTIVE"} />
        }
      />

      {/* Identity hero with overlapping avatar */}
      <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
        <div className="bg-linear-to-br from-[#f3e8cd] via-[#faf5ea] to-[#ffffff] px-6 pt-6 pb-16 sm:px-8 dark:from-[#1a2332] dark:via-[#22304a] dark:to-[#2f4362]">
          <StatusBadge status={user.role} />
        </div>
        <div className="px-6 pb-6 sm:px-8">
          <Avatar className="-mt-12 h-24 w-24 border-4 border-card shadow-xl sm:h-28 sm:w-28">
            <AvatarFallback className="bg-linear-to-br from-primary to-primary/80 text-2xl font-semibold text-primary-foreground sm:text-3xl">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {user.name || "User"}
          </h2>
          <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-4 w-4" />
            {user.email}
          </p>
        </div>
      </div>

      {/* Account Information */}
      <section>
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
          <UserIcon className="h-5 w-5 text-primary" />
          Account Information
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {userData.map((item, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border bg-muted/30 p-5 transition-all hover:border-primary/30 hover:bg-muted/50"
            >
              <Label className="flex items-center gap-1 text-xs font-medium tracking-wider text-muted-foreground uppercase">
                {item.icon && <item.icon className="h-3 w-3" />}
                {item.label}
              </Label>
              {item.badge ? (
                <div className="mt-3">
                  <StatusBadge status={item.value} dot={false} />
                </div>
              ) : (
                <p className="mt-3 text-base font-medium text-foreground">
                  {item.value}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Security Section */}
      <section>
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
          <KeyRound className="h-5 w-5 text-primary" />
          Security
        </h3>
        <div className="rounded-2xl border border-border bg-muted/30 p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="flex items-center gap-2 font-medium text-foreground">
                <Lock className="h-4 w-4 text-muted-foreground" />
                Password
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                ••••••••••••••
              </p>
            </div>

            {/* change password dialog  */}
            <ChangePasswordDialog
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              form={form}
              isLoading={isLoading}
              showNewPassword={showNewPassword}
              setShowNewPassword={setShowNewPassword}
              showCurrentPassword={showCurrentPassword}
              setShowCurrentPassword={setShowCurrentPassword}
              handleChangePassword={handleChangePassword}
            />
          </div>
        </div>
      </section>

      {/* Notifications Section */}
      <section>
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
          <BellRing className="h-5 w-5 text-primary" />
          Notifications
        </h3>
        <div className="rounded-2xl border border-border bg-muted/30 p-7">
          <PushToggle />
        </div>
      </section>
    </div>
  )
}
