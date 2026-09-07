"use client"

import { useCallback, useEffect, useRef, useState } from "react"

// Matches duration-200 on the dialog/alert-dialog entrance animation. The
// heavy content swaps in only once the entrance has finished — swapping
// mid-animation resizes the centered box and causes visible jitter.
const OPEN_MS = 200

// Two-phase dialog mount for INP with jitter-free animation: the opening
// click paints the lightweight shell (skeleton) immediately, and the heavy
// content mounts only after the entrance animation has completed. On close,
// nothing swaps — Radix keeps the real content mounted through the exit
// animation and unmounts it when the animation ends.
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
      clearTimer()
      setOpen(next)
      if (next) {
        // Fresh shell for every open; the content swaps in after the
        // entrance animation completes, so the box never re-centers
        // mid-animation (open jitter).
        setContentReady(false)
        timer.current = setTimeout(() => {
          timer.current = null
          setContentReady(true)
        }, OPEN_MS)
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
