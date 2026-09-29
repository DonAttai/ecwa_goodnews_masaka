import AddMemberButton from "./create/components/add-member-button"
import { Member } from "./columns"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/app/actions/auth"
import MemberTable from "./member-table"
import { PageHeader } from "@/components/ui/page-header"

const PAGE_SIZE = 20

type MembersPageProps = {
  searchParams: Promise<{ page?: string; q?: string }>
}

export default async function MembersPage({ searchParams }: MembersPageProps) {
  const [user, params] = await Promise.all([getCurrentUser(), searchParams])

  if (!user) redirect("/login")

  if (user.role === "WORKER") redirect("/dashboard")

  const isAdmin = user.role === "ADMIN"
  const canCreate = isAdmin || user.role === "EDITOR"

  const page = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1)
  const q = (params.q ?? "").trim()

  const where = q
    ? {
        OR: [
          { firstName: { contains: q, mode: "insensitive" as const } },
          { surname: { contains: q, mode: "insensitive" as const } },
          { email: { contains: q, mode: "insensitive" as const } },
        ],
      }
    : {}

  const [total, membersData] = await Promise.all([
    prisma.member.count({ where }),
    prisma.member.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ])

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)

  const data = membersData as unknown as Member[]

  return (
    <div className="space-y-4 sm:space-y-6">
      <PageHeader
        eyebrow="People"
        title="Members"
        description={total === 0 ? "Register your first member" : `${total} ${total === 1 ? "member" : "members"} in the family`}
        actions={canCreate ? <AddMemberButton /> : undefined}
      />

      <MemberTable
        isAdmin={isAdmin}
        data={data}
        total={total}
        currentPage={currentPage}
        totalPages={totalPages}
        query={q}
      />
    </div>
  )
}
