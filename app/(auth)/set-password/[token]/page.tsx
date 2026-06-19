import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import SetPasswordForm from "./set-password-form"
import { Toaster } from "sonner"

export default async function Page({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md border-border bg-card shadow-2xl">
        <CardHeader className="space-y-3 text-center">
          <CardTitle className="text-gold text-2xl font-bold tracking-tight sm:text-3xl">
            ECWA Goodnews 1, Masaka
          </CardTitle>

          <CardDescription className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            Set your password to activate and access your account securely
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 px-6 pb-8">
          <SetPasswordForm token={token} />
        </CardContent>
      </Card>
      <Toaster />
    </main>
  )
}
