// app/(dashboard)/dashboard/members/[memberId]/edit/page.tsx

import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { notFound, redirect } from "next/navigation"
import UpdateMemberForm from "./components/update-member-form"

type EditPageProps = {
  params: Promise<{ memberId: string }>
}

// Helper function to map database member to form values
function mapMemberToFormValues(member: any) {
  const formatDate = (date: Date | null | undefined): string | undefined => {
    if (!date) return undefined
    return date.toISOString().split("T")[0]
  }

  const mapYesNo = (
    value: string | null | undefined
  ): "YES" | "NO" | undefined => {
    if (value === "YES") return "YES"
    if (value === "NO") return "NO"
    return undefined
  }

  return {
    id: member.id,
    surname: member.surname,
    firstName: member.firstName,
    otherNames: member.otherNames ?? undefined,
    presentAddress: member.presentAddress,
    phoneNumber: member.phoneNumber,
    email: member.email ?? undefined,
    previousPlaceOfWorship: member.previousPlaceOfWorship ?? undefined,
    maritalStatus: member.maritalStatus ?? undefined,
    spouseName: member.spouseName ?? undefined,
    homeCell: member.homeCell ?? undefined,
    zone: member.zone ?? undefined,
    acceptedChrist: mapYesNo(member.acceptedChrist),
    baptized: mapYesNo(member.baptized),
    baptismPlace: member.baptismPlace ?? undefined,
    baptizedBy: member.baptizedBy ?? undefined,
    communicant: mapYesNo(member.communicant),
    beenOnDiscipline: mapYesNo(member.beenOnDiscipline),
    disciplineReason: member.disciplineReason ?? undefined,
    disciplineDate: formatDate(member.disciplineDate),
    disciplineReliefDate: formatDate(member.disciplineReliefDate),
    children: member.children ?? [],
    fellowshipGroupIds: member.fellowshipGroupIds ?? [],
  }
}

export default async function EditMemberPage({ params }: EditPageProps) {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  if (session.role !== "ADMIN") {
    redirect("/dashboard")
  }

  const memberId = (await params).memberId
  const member = await prisma.member.findUnique({
    where: { id: memberId },
  })

  if (!member) {
    notFound()
  }

  const formattedMember = mapMemberToFormValues(member)

  // Add a unique key to force a fresh instance
  return <UpdateMemberForm key={memberId} member={formattedMember} />
}
