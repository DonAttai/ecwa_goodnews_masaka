import type { Metadata } from "next"
import { Fraunces } from "next/font/google"
import SiteHeader from "./components/site-header"
import SiteFooter from "./components/site-footer"
import { getSiteSettings } from "@/lib/site"

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
})

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  return {
    title: {
      default: settings.churchName,
      template: `%s | ${settings.churchName}`,
    },
    description:
      settings.welcomeMessage ??
      "A welcoming church in Masaka — worship, fellowship, and growth in Christ.",
  }
}

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await getSiteSettings()
  return (
    <div className={`${fraunces.variable} min-h-screen bg-background text-foreground`}>
      <div className="relative z-10">
        <SiteHeader churchName={settings.churchName} address={settings.address} />
        <main className="min-h-[70vh]">{children}</main>
        <SiteFooter settings={settings} />
      </div>
    </div>
  )
}
