"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"

export function CopyNumberButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard unavailable — no-op
    }
  }

  return (
    <button
      onClick={copy}
      aria-label="Copy account number"
      className="flex shrink-0 items-center gap-1.5 rounded-xl border border-border px-3.5 py-2 text-xs font-bold transition hover:border-primary hover:text-primary"
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? "Copied" : "Copy"}
    </button>
  )
}
