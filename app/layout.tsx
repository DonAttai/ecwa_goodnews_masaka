import { Geist, Geist_Mono } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { Toaster } from "sonner"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        geist.variable
      )}
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
        <CustomToaster />
      </body>
    </html>
  )
}

function CustomToaster() {
  return (
    <Toaster
      richColors
      position="top-center"
      duration={4000}
      visibleToasts={3}
      className="font-sans"
      toastOptions={{
        className: "font-medium",
        style: {
          borderRadius: "12px",
          padding: "16px",
        },
      }}
    />
  )
}
