"use client"
import { useState, useTransition } from "react"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  KeyRound,
  Mail,
  User as UserIcon,
  Calendar,
  Shield,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Lock,
} from "lucide-react"
import changePassword from "./actions"
import { toast } from "sonner"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import ChangePasswordDialog from "./components/change-password-dialog"

interface User {
  id: string
  name: string | null
  email: string
  role: string
  isActive: boolean
  createdAt: Date
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
      const result = await changePassword(data)
      if (!result.success) {
        toast.error(result.message ?? "Request to change password failed")
        return
      }

      form.reset({ currentPassword: "", newPassword: "" })
      toast.success("Login with your new password")
    } catch (error) {
      toast.error("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-gold text-4xl font-bold tracking-tight">
                My Profile
              </h1>
              <p className="mt-2 text-muted-foreground">
                Manage your account settings and preferences
              </p>
            </div>
            <Badge
              variant={user.isActive ? "default" : "secondary"}
              className="capitalize"
            >
              {user.isActive ? (
                <>
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Active
                </>
              ) : (
                <>
                  <XCircle className="mr-1 h-3 w-3" />
                  Inactive
                </>
              )}
            </Badge>
          </div>
        </div>

        {/* Main Content */}
        <Card className="overflow-hidden border-border bg-card shadow-2xl">
          {/* Profile Header */}
          <div className="bg-linear-to-r from-primary/20 via-primary/10 to-transparent p-8">
            <div className="flex flex-wrap items-center gap-6">
              <Avatar className="h-28 w-28 border-4 border-background shadow-xl">
                <AvatarFallback className="bg-linear-to-br from-primary to-primary/80 text-3xl font-semibold text-primary-foreground">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-3xl font-semibold tracking-tight text-foreground">
                  {user.name || "User"}
                </h2>
                <p className="mt-1 flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          <CardContent className="p-8">
            {/* Account Information */}
            <div className="mb-10">
              <h3 className="mb-5 flex items-center gap-2 text-lg font-semibold text-foreground">
                <UserIcon className="h-5 w-5 text-primary" />
                Account Information
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {[
                  { label: "Full Name", value: user.name || "Not provided" },
                  { label: "Email Address", value: user.email, icon: Mail },
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
                ].map((item, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border-border bg-muted/30 p-5 transition-all hover:border-primary/30 hover:bg-muted/50"
                  >
                    <Label className="flex items-center gap-1 text-xs font-medium tracking-wider text-muted-foreground uppercase">
                      {item.icon && <item.icon className="h-3 w-3" />}
                      {item.label}
                    </Label>
                    {item.badge ? (
                      <Badge
                        variant="outline"
                        className="mt-3 text-sm text-foreground capitalize"
                      >
                        {item.value}
                      </Badge>
                    ) : (
                      <p className="mt-3 text-base font-medium text-foreground">
                        {item.value}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <Separator className="my-8 bg-border" />

            {/* Security Section */}
            <div>
              <h3 className="mb-5 flex items-center gap-2 text-lg font-semibold text-foreground">
                <KeyRound className="h-5 w-5 text-primary" />
                Security
              </h3>
              <div className="rounded-2xl border-border bg-muted/30 p-7">
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
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
