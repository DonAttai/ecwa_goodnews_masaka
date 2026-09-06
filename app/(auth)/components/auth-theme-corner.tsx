"use client"

import { ModeToggle } from "@/components/mode-toggle"
import { cn } from "@/lib/utils"

export function AuthThemeCorner({ className }: { className?: string }) {
  return (
    <div className={cn("absolute top-4 right-4 z-10", className)}>
      <ModeToggle />
    </div>
  )
}
