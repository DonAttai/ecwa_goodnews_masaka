"use client"

import { useCallback, useEffect, useRef, useState } from "react"

// Matches duration-200 on the dialog/alert-dialog exit animation.
const EXIT_MS = 200

// Two-phase dialog mount for INP: the opening click paints the lightweight
// shell first, and the heavy content mounts on the next frame. On close, the
// content stays mounted through the exit animation and only swaps back to the
// placeholder once the dialog has finished closing — otherwise the exiting
// dialog visibly snaps from content to placeholder (close jitter).
export function useDialogFormReady() {
  const [open, setOpen] = useState(false)
  const [contentReady, setContentReady] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearTimer = useCallback(() => {
    if (timer.current !== null) {
      clearTimeout(timer.current)
      timer.current = null
    }
  }, [])

  useEffect(() => {
    return () => {
      if (timer.current !== null) clearTimeout(timer.current)
    }
  }, [])

  const handleOpenChange = useCallback(
    (next: boolean) => {
      setOpen(next)
      if (next) {
        clearTimer()
        requestAnimationFrame(() => setContentReady(true))
      } else {
        timer.current = setTimeout(() => {
          timer.current = null
          setContentReady(false)
        }, EXIT_MS)
      }
    },
    [clearTimer]
  )

  const handleClose = useCallback(
    () => handleOpenChange(false),
    [handleOpenChange]
  )

  return { open, contentReady, handleOpenChange, handleClose }
}
