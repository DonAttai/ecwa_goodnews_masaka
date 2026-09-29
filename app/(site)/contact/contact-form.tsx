"use client"

import { useState } from "react"
import { CheckCircle2, Loader2, Send } from "lucide-react"
import { submitContactMessage } from "./actions"

const inputCls =
  "w-full rounded-2xl border border-border bg-muted/40 px-4 py-3.5 text-sm outline-none transition placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/25"

export default function ContactForm() {
  const [status, setStatus] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [pending, setPending] = useState(false)

  async function onSubmit(formData: FormData) {
    setPending(true)
    setStatus(null)
    setSuccess(false)
    const res = await submitContactMessage(formData)
    setPending(false)
    setStatus(res.message)
    setSuccess(res.success)
    if (res.success) {
      ;(document.getElementById("contact-form") as HTMLFormElement)?.reset()
    }
  }

  if (success) {
    return (
      <div role="status" className="flex flex-col items-center rounded-2xl border border-emerald-500/25 bg-emerald-500/8 px-6 py-10 text-center">
        <CheckCircle2 className="h-10 w-10 text-emerald-600" aria-hidden />
        <p className="font-display mt-4 text-xl font-semibold">Message received</p>
        <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
          {status ?? "Thank you — the pastoral team will reply within 24 hours. For urgent prayer, call the church line."}
        </p>
        <button
          type="button"
          onClick={() => setSuccess(false)}
          className="mt-5 rounded-xl border border-border px-5 py-2.5 text-sm font-semibold transition hover:bg-muted/60"
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form id="contact-form" action={onSubmit} className="space-y-4" aria-busy={pending}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="name">
            Full name <span aria-hidden className="text-destructive">*</span>
          </label>
          <input
            id="name"
            name="name"
            required
            minLength={2}
            autoComplete="name"
            placeholder="Your name"
            className={inputCls}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="phone">
            Phone / WhatsApp <span aria-hidden className="text-destructive">*</span>
          </label>
          <input
            id="phone"
            name="phone"
            required
            inputMode="tel"
            autoComplete="tel"
            placeholder="080..."
            className={inputCls}
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="subject">
          Subject
        </label>
        <select
          id="subject"
          name="subject"
          className={inputCls}
        >
          <option>General enquiry</option>
          <option>Prayer request</option>
          <option>Join a ministry</option>
          <option>Testimony</option>
          <option>Welfare / Visitation</option>
        </select>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="message">
          Message <span aria-hidden className="text-destructive">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          minLength={10}
          rows={5}
          placeholder="How can we help or pray with you?"
          className={inputCls}
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="btn-gold inline-flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 text-sm font-bold disabled:opacity-60 sm:w-auto active:scale-[.98]"
      >
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        {pending ? "Sending..." : "Send message"}
      </button>
      {status && !success && (
        <p role="alert" className="rounded-xl border border-destructive/25 bg-destructive/8 px-4 py-3 text-sm text-destructive">
          {status}
        </p>
      )}
    </form>
  )
}
