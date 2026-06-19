import { Button } from "@/components/ui/button"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff, KeyRound } from "lucide-react"
import { Controller, UseFormReturn } from "react-hook-form"
import { ChangePassworSchemaType } from "../profile-client"

interface ChangePasswordDialogProp {
  isOpen: boolean
  setIsOpen: (value: boolean) => void
  showNewPassword: boolean
  setShowNewPassword: (value: boolean) => void
  showCurrentPassword: boolean
  setShowCurrentPassword: (value: boolean) => void
  form: UseFormReturn<ChangePassworSchemaType>
  handleChangePassword: ({
    newPassword,
    currentPassword,
  }: ChangePassworSchemaType) => Promise<void>
  isLoading: boolean
}

export default function ChangePasswordDialog({
  isOpen,
  setIsOpen,
  form,
  handleChangePassword,
  isLoading,
  showNewPassword,
  setShowNewPassword,
  showCurrentPassword,
  setShowCurrentPassword,
}: ChangePasswordDialogProp) {
  return (
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
          onSubmit={form.handleSubmit(handleChangePassword)}
          className="space-y-5"
        >
          {/* NEW PASSWORD */}
          <Controller
            name="newPassword"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name} className="text-foreground">
                  New Password
                </FieldLabel>

                <div className="relative">
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="New password"
                    autoComplete="new-password"
                    className="border-border bg-muted/30 pr-10 text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                    type={showNewPassword ? "text" : "password"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground focus:outline-none"
                    tabIndex={-1}
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <FieldDescription className="text-muted-foreground">
                  Password must be at least 8 characters.
                </FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* CURRENT PASSWORD */}
          <Controller
            name="currentPassword"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name} className="text-foreground">
                  Current Password
                </FieldLabel>

                <div className="relative">
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Current your password"
                    autoComplete="new-password"
                    className="border-border bg-muted/30 pr-10 text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                    type={showCurrentPassword ? "text" : "password"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground focus:outline-none"
                    tabIndex={-1}
                  >
                    {showCurrentPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Button
            type="submit"
            className="btn-gold w-full py-5 text-base font-semibold"
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : " Submit"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
