import { redirect } from "next/navigation"
import SettingsPage from "./components/settings-page"
import { prisma } from "@/lib/prisma"
import { GeneralType } from "./types/general"
import { getCurrentUser } from "@/app/actions/auth"

async function getFellowships() {
  return prisma.fellowshipGroup.findMany({
    select: {
      id: true,
      name: true,
      description: true,
    },
    orderBy: { name: "asc" },
  })
}

async function getSettings() {
  return prisma.settings.findUnique({ where: { id: 1 } })
}
export default async function Settings() {
  const user = await getCurrentUser()

  if (!user) redirect("/login")
  if (user.role !== "ADMIN") redirect("/dashboard")

  const [fellowships, settings] = await Promise.all([
    getFellowships(),
    getSettings(),
  ])

  const formattedFellowships = fellowships.map((fellowship) => ({
    id: fellowship.id,
    name: fellowship.name,
    description: fellowship.description ?? undefined,
  }))

  const formatSettings = (settings: any): GeneralType => {
    if (!settings) {
      return {
        churchName: "",
      }
    }

    return {
      id: settings.id,
      churchName: settings.churchName,
      address: settings.address ?? undefined,
      phone: settings.phone ?? undefined,
      email: settings.email ?? undefined,
      website: settings.website ?? undefined,
      logoUrl: settings.logoUrl ?? undefined,
      welcomeMessage: settings.welcomeMessage ?? undefined,
    }
  }

  return (
    <SettingsPage
      fellowships={formattedFellowships}
      generalSettings={formatSettings(settings)}
    />
  )
}
