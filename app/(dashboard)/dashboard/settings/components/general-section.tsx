import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Upload } from "lucide-react"
import { GeneralType } from "../types/general"
import { Controller, UseFormReturn } from "react-hook-form"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"

interface GeneralPropTypes {
  generalSettings: GeneralType | null
  form: UseFormReturn<GeneralType>
  handleUpdateSettings: (data: GeneralType) => Promise<void>
  isPending: boolean
}

export default function GeneralSection({
  generalSettings,
  form,
  handleUpdateSettings,
  isPending,
}: GeneralPropTypes) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Church Information</CardTitle>
        <CardDescription>Basic details and branding</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="flex items-center gap-6">
          <Avatar className="h-24 w-24 border-4 border-background">
            <AvatarImage src={generalSettings?.logoUrl} />
            <AvatarFallback className="text-4xl">⛪</AvatarFallback>
          </Avatar>
          <div>
            <Button variant="outline">
              <Upload className="mr-2 h-4 w-4" /> Upload Logo
            </Button>
            <p className="mt-2 text-xs text-muted-foreground">
              Recommended: 512×512 PNG. Max 2MB.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Controller
              name="churchName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="church-name">Church Name</FieldLabel>

                  <Input
                    {...field}
                    id="church-name"
                    aria-invalid={fieldState.invalid}
                    placeholder="e.g Ecwa Goodnews"
                    autoComplete="off"
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
          <div className="space-y-2">
            <Controller
              name="phone"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="phone-number">Phone Number</FieldLabel>

                  <Input
                    {...field}
                    id="phone-number"
                    aria-invalid={fieldState.invalid}
                    placeholder="e.g 080xxxxxxxxxxx"
                    autoComplete="off"
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Controller
            name="address"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="address">Address</FieldLabel>
                <Textarea
                  {...field}
                  id="address"
                  aria-invalid={fieldState.invalid}
                  className="min-h-30"
                />
                <FieldDescription>Give a welcome message</FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="email">Admin Email</FieldLabel>

                  <Input
                    {...field}
                    id="email"
                    aria-invalid={fieldState.invalid}
                    placeholder="e.g grace@example.com"
                    autoComplete="off"
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
          <div className="space-y-2">
            <Controller
              name="website"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="website">Website</FieldLabel>

                  <Input
                    {...field}
                    id="website"
                    aria-invalid={fieldState.invalid}
                    placeholder="e.g www.example.com"
                    autoComplete="off"
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Controller
            name="welcomeMessage"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="welcome-message">
                  Welcome Message
                </FieldLabel>
                <Textarea
                  {...field}
                  id="welcome-message"
                  aria-invalid={fieldState.invalid}
                  className="min-h-30"
                />
                <FieldDescription>Give a welcome message</FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
        <Button
          onClick={form.handleSubmit(handleUpdateSettings)}
          disabled={isPending}
        >
          {isPending ? "Saving Settings" : "Save Settings"}
        </Button>
      </CardContent>
    </Card>
  )
}
