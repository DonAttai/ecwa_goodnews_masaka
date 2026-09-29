"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"
import { toast } from "sonner"

export function CopyNumberButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      toast.success("Account number copied")
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error("Copy failed — long-press to copy manually")
    }
  }

  return (
    <button
      onClick={copy}
      aria-live="polite"
      aria-label={copied ? "Account number copied" : "Copy account number"}
      className="flex shrink-0 items-center gap-1.5 rounded-xl border border-border px-3.5 py-2.5 text-xs font-bold transition hover:border-primary hover:text-primary-deep focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none active:scale-[.97]"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? "Copied!" : "Copy"}
    </button>
  )
}
