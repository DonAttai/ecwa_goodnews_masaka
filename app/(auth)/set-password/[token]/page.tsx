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
    <main className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-950 via-slate-900 to-slate-800 px-4">
      <Card className="w-full max-w-md border border-slate-800/60 bg-slate-900/70 shadow-2xl backdrop-blur-xl">
        <CardHeader className="space-y-3 text-center">
          <CardTitle className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            ECWA Goodnews 1, Masaka
          </CardTitle>

          <CardDescription className="text-sm leading-relaxed text-slate-400 sm:text-base">
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
