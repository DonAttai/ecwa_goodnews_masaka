import AddMemberButton from "./create/components/add-member-button"
import { columns, Member } from "./columns"
import { DataTable } from "./data-table"
import { members } from "./data/data"
import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"

async function getData(): Promise<Member[]> {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }
  return members as unknown as Member[]
}

export default async function MembersPage() {
  const data = await getData()

  const session = await getSession()
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Members</h1>

          <p className="text-slate-400">Manage church members</p>
        </div>

        {session?.role === "ADMIN" && <AddMemberButton />}
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  )
}
