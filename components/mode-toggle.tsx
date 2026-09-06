"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ModeToggleProps {
  className?: string
}

export function ModeToggle({ className }: ModeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted && resolvedTheme === "dark"

  return (
    <Button
      variant="ghost"
      size="icon"
      type="button"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={mounted ? isDark : undefined}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "size-10 rounded-2xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
        className
      )}
    >
      {mounted && isDark ? (
        <Sun className="h-5 w-5" aria-hidden="true" />
      ) : (
        <Moon className="h-5 w-5" aria-hidden="true" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
