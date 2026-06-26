import Link from "next/link"
import { TriangleAlert, ArrowLeft } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function InvalidResetLink() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-8 sm:px-6">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-4 text-center">
          <TriangleAlert className="mx-auto h-12 w-12 text-amber-500" />

          <p className="text-gold text-sm font-semibold tracking-wide">
            ECWA Goodnews 1, Masaka
          </p>

          <CardTitle className="text-2xl font-bold">
            Reset link unavailable
          </CardTitle>

          <CardDescription className="text-base leading-relaxed">
            This password reset link is invalid or has expired. Request a new
            reset link to continue.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Button asChild className="w-full">
            <Link href="/forgot-password">Request new reset link</Link>
          </Button>
        </CardContent>

        <CardFooter className="justify-center">
          <Link
            href="/login"
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to sign in
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
