import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import MemberDetails from "./components/member-details"
import { getCurrentUser, isAdmin } from "@/app/actions/auth"
import { MemberFormValues } from "../schemas"

type MemberPageProps = {
  params: Promise<{ memberId: string }>
}
export default async function MemberPage({ params }: MemberPageProps) {
  const user = await getCurrentUser()
  if (!user) redirect("/login")

  const memberId = (await params).memberId
  const isAdmin = user.role === "ADMIN"

  const member = await prisma.member.findUnique({
    where: { id: memberId },
    include: {
      children: true,
      fellowshipGroups: {
        include: {
          fellowship: true,
        },
      },
    },
  })

  if (!member) redirect("/dashboard/members")

  return (
    <MemberDetails
      member={
        {
          ...member,
          gender: (member.gender as "MALE") || "FEMALE",
          fellowshipGroupIds: member.fellowshipGroups.map(
            (fg) => fg.fellowship.id
          ),
        } as MemberFormValues
      }
      isAdmin={isAdmin}
    />
  )
}
