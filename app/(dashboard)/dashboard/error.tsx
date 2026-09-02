"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Dashboard error:", error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
        <AlertTriangle className="h-8 w-8 text-destructive" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">
          Something went wrong
        </h2>
        <p className="max-w-md text-sm text-muted-foreground">
          We could not load your dashboard. This is usually temporary — please
          try again.
        </p>
        {error.digest && (
          <p className="text-xs text-muted-foreground/70">
            Reference: {error.digest}
          </p>
        )}
      </div>
      <div className="flex gap-3">
        <Button onClick={reset}>Try again</Button>
        <Button
          variant="outline"
          onClick={() => (window.location.href = "/login")}
        >
          Back to login
        </Button>
      </div>
    </div>
  )
}
