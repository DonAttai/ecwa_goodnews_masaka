import ContactForm from "./contact-form"
import { getSiteSettings, SITE_IMAGES } from "@/lib/site"
import { MapPin, Phone, Mail, Clock } from "lucide-react"
import PageHero from "../components/page-hero"
import Reveal from "../components/reveal"

export const revalidate = 3600

export default async function ContactPage() {
  const settings = await getSiteSettings()

  return (
    <div>
      <PageHero
        eyebrow="Contact"
        title={
          <>
            Let&apos;s talk. <span className="text-gold">We reply.</span>
          </>
        }
        lede="Prayer requests, testimonies, joining a ministry, or planning a visit — send word."
        image={SITE_IMAGES.huddle}
      />

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-14 sm:px-6 sm:py-16 lg:grid-cols-5">
        <Reveal className="lg:col-span-2">
          <div className="flex h-full flex-col rounded-[1.75rem] bg-[#141c2b] p-7 text-white sm:p-9">
            <p className="text-xs font-bold tracking-[0.24em] text-[#e8d5a3] uppercase">
              Find us
            </p>
            <ul className="mt-5 space-y-5 text-sm leading-6">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#c9a84c]" />
                <span>{settings.address}</span>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 h-5 w-5 shrink-0 text-[#c9a84c]" />
                <span>{settings.phone}</span>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 h-5 w-5 shrink-0 text-[#c9a84c]" />
                <span>{settings.email}</span>
              </li>
              <li className="flex gap-3">
                <Clock className="mt-0.5 h-5 w-5 shrink-0 text-[#c9a84c]" />
                <span>
                  Sundays 8:00 AM • Tuesdays & Wednesdays 5:00 PM
                  <br />
                  Office: Mon–Fri, 9:00 AM – 4:00 PM
                </span>
              </li>
            </ul>
            <div className="mt-auto pt-8">
              <p className="font-display text-lg text-[#e8d5a3] italic">
                &ldquo;Call to me and I will answer you.&rdquo;
              </p>
              <p className="mt-1 text-xs tracking-[0.2em] text-white/50 uppercase">
                Jeremiah 33:3
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={120} className="lg:col-span-3">
          <div className="h-full rounded-[1.75rem] border border-border bg-card p-6 sm:p-9">
            <p className="font-display text-2xl font-semibold">
              Send a message
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Prayer requests go straight to the pastoral team.
            </p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  )
}
