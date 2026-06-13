import AddMemberButton from "./create/components/add-member-button"
import { columns, Member } from "./columns"
import { DataTable } from "./data-table"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { isAdmin } from "@/app/actions/auth"

async function getData(): Promise<Member[]> {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  const membersData = await prisma.member.findMany({
    orderBy: { createdAt: "desc" },
  })
  return membersData as unknown as Member[]
}

export default async function MembersPage() {
  const data = await getData()
  const isAdminUser = await isAdmin()

  return (
    <div className="space-y-4 px-4 py-4 sm:space-y-6 sm:px-6 sm:py-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
        <div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">Members</h1>
          <p className="text-sm text-slate-400 sm:text-base">
            Manage church members
          </p>
        </div>

        {isAdminUser && (
          <div className="self-start sm:self-auto">
            <AddMemberButton />
          </div>
        )}
      </div>

      {/* Add responsive overflow handling for the table */}
      <div className="-mx-4 overflow-x-auto sm:mx-0">
        <div className="inline-block min-w-full align-middle">
          <DataTable columns={columns} data={data} />
        </div>
      </div>
    </div>
  )
}
