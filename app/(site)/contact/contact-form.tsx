"use client"

import { useState } from "react"
import { submitContactMessage } from "./actions"

export default function ContactForm() {
  const [status, setStatus] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function onSubmit(formData: FormData) {
    setPending(true)
    setStatus(null)
    const res = await submitContactMessage(formData)
    setPending(false)
    setStatus(res.message)
    if (res.success) {
      ;(document.getElementById("contact-form") as HTMLFormElement)?.reset()
    }
  }

  return (
    <form id="contact-form" action={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="name">
            Full name
          </label>
          <input
            id="name"
            name="name"
            required
            placeholder="Your name"
            className="w-full rounded-2xl border border-border bg-muted/40 px-4 py-3.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/25"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="phone">
            Phone / WhatsApp
          </label>
          <input
            id="phone"
            name="phone"
            required
            placeholder="080..."
            className="w-full rounded-2xl border border-border bg-muted/40 px-4 py-3.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/25"
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
          className="w-full rounded-2xl border border-border bg-muted/40 px-4 py-3.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/25"
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
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="How can we help or pray with you?"
          className="w-full rounded-2xl border border-border bg-muted/40 px-4 py-3.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/25"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="btn-gold w-full rounded-2xl px-6 py-4 text-sm font-bold disabled:opacity-60 sm:w-auto"
      >
        {pending ? "Sending..." : "Send message"}
      </button>
      {status && <p className="text-sm text-muted-foreground">{status}</p>}
    </form>
  )
}
