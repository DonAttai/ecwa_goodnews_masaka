"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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

interface User {
  id: string
  name: string | null
  email: string
  role: string
  isActive: boolean
  createdAt: Date
}

export default function ProfileClient({ user }: { user: User }) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [message, setMessage] = useState<{
    type: "success" | "error"
    text: string
  } | null>(null)

  const getInitials = (name: string | null) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsChangingPassword(true)
    setMessage(null)

    try {
      const result = await changePassword(currentPassword, newPassword)
      if (!result.success) {
        setMessage({ type: "error", text: result.message })
        return
      }

      setMessage({ type: "success", text: result.message })
      setCurrentPassword("")
      setNewPassword("")

      setTimeout(() => {
        setIsOpen(false)
        setMessage(null)
      }, 1500)
    } finally {
      setIsChangingPassword(false)
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="bg-linear-to-r from-white via-slate-200 to-slate-300 bg-clip-text text-4xl font-bold tracking-tight text-transparent">
                My Profile
              </h1>
              <p className="mt-2 text-slate-400">
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

        {/* Alert Messages */}
        {message && (
          <div className="mb-8 animate-in duration-300 slide-in-from-top-5 fade-in">
            <Alert
              className={`${
                message.type === "success"
                  ? "border-green-500/50 bg-green-950/30"
                  : "border-red-500/50 bg-red-950/30"
              } transition-all duration-300`}
            >
              <AlertDescription className="flex items-center gap-2">
                {message.type === "success" ? (
                  <CheckCircle className="h-4 w-4 text-green-400" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-400" />
                )}
                {message.text}
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Main Content */}
        <Card className="overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl">
          {/* Profile Header */}
          <div className="bg-linear-to-r from-primary/20 via-primary/10 to-transparent p-8">
            <div className="flex flex-wrap items-center gap-6">
              <Avatar className="h-28 w-28 border-4 border-slate-900 shadow-xl">
                <AvatarFallback className="bg-linear-to-br from-primary to-primary/80 text-3xl font-semibold text-primary-foreground">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-3xl font-semibold tracking-tight text-white">
                  {user.name || "User"}
                </h2>
                <p className="mt-1 flex items-center gap-2 text-slate-400">
                  <Mail className="h-4 w-4" />
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          <CardContent className="p-8">
            {/* Account Information */}
            <div className="mb-10">
              <h3 className="mb-5 flex items-center gap-2 text-lg font-semibold text-white">
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
                    className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5 transition-all hover:border-primary/30 hover:bg-slate-900"
                  >
                    <Label className="flex items-center gap-1 text-xs font-medium tracking-wider text-slate-400 uppercase">
                      {item.icon && <item.icon className="h-3 w-3" />}
                      {item.label}
                    </Label>
                    {item.badge ? (
                      <Badge
                        variant="outline"
                        className="mt-3 text-sm text-white capitalize"
                      >
                        {item.value}
                      </Badge>
                    ) : (
                      <p className="mt-3 text-base font-medium text-white">
                        {item.value}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <Separator className="my-8 bg-slate-800" />

            {/* Security Section */}
            <div>
              <h3 className="mb-5 flex items-center gap-2 text-lg font-semibold text-white">
                <KeyRound className="h-5 w-5 text-primary" />
                Security
              </h3>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-7">
                {/* ... rest of security section remains same ... */}
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="flex items-center gap-2 font-medium text-white">
                      <Lock className="h-4 w-4 text-slate-400" />
                      Password
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      ••••••••••••••
                    </p>
                  </div>

                  <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="gap-2">
                        <KeyRound className="h-4 w-4" />
                        Change Password
                      </Button>
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Change Password</DialogTitle>
                        <DialogDescription>
                          Enter your current password and choose a new one.
                        </DialogDescription>
                      </DialogHeader>

                      <form
                        onSubmit={handleChangePassword}
                        className="space-y-5"
                      >
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword">
                            Current Password
                          </Label>
                          <div className="relative">
                            <Input
                              id="currentPassword"
                              type={showCurrentPassword ? "text" : "password"}
                              value={currentPassword}
                              onChange={(e) =>
                                setCurrentPassword(e.target.value)
                              }
                              placeholder="Enter your current password"
                              required
                              autoComplete="current-password"
                              className="pr-10"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowCurrentPassword(!showCurrentPassword)
                              }
                              className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 hover:text-white"
                            >
                              {showCurrentPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="newPassword">New Password</Label>
                          <div className="relative">
                            <Input
                              id="newPassword"
                              type={showNewPassword ? "text" : "password"}
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              placeholder="Enter your new password"
                              required
                              autoComplete="new-password"
                              className="pr-10"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowNewPassword(!showNewPassword)
                              }
                              className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 hover:text-white"
                            >
                              {showNewPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </div>

                        <DialogFooter className="gap-3 pt-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setIsOpen(false)
                              setCurrentPassword("")
                              setNewPassword("")
                              setMessage(null)
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            disabled={
                              isChangingPassword ||
                              !currentPassword ||
                              !newPassword
                            }
                          >
                            {isChangingPassword
                              ? "Changing..."
                              : "Change Password"}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
