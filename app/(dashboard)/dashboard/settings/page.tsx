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

async function getDepartments() {
  return prisma.department.findMany({
    select: {
      id: true,
      name: true,
      description: true,
    },
    orderBy: { name: "asc" },
  })
}

export default async function Settings() {
  const user = await getCurrentUser()

  if (!user) redirect("/login")
  if (user.role !== "ADMIN") redirect("/dashboard")

  const [fellowships, settings, departments] = await Promise.all([
    getFellowships(),
    getSettings(),
    getDepartments(),
  ])

  const formattedFellowships = fellowships.map(
    (fellowship: { id: string; name: string; description: string | null }) => ({
      id: fellowship.id,
      name: fellowship.name,
      description: fellowship.description ?? undefined,
    })
  )

  const formattedDepartments = departments.map(
    (department: { id: string; name: string; description: string | null }) => ({
      id: department.id,
      name: department.name,
      description: department.description ?? undefined,
    })
  )

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
      departments={formattedDepartments}
      generalSettings={formatSettings(settings)}
    />
  )
}
