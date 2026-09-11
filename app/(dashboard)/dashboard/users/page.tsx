import { redirect } from "next/navigation"
import { User } from "./columns"
import UserTable from "./user-table"
import AddUserDialog from "./components/add-user-dialog"
import { getAllUsers, getCurrentUser } from "@/app/actions/auth"
import { getDepartments } from "../settings/actions/department"

async function getData(
  page: number,
  query: string
): Promise<{
  users: User[]
  departments: Array<{ id: string; name: string }>
  total: number
  totalPages: number
}> {
  const user = await getCurrentUser()

  if (!user) redirect("/login")

  if (user?.role !== "ADMIN") redirect("/dashboard")

  const [{ users, total, totalPages }, departments] = await Promise.all([
    getAllUsers(page, PAGE_SIZE, query),
    getDepartments(),
  ])

  return {
    users: users.map((user: User) => ({
      ...user,
      department: user.department
        ? { id: user.department.id, name: user.department.name }
        : null,
    })),
    departments,
    total,
    totalPages,
  }
}

const PAGE_SIZE = 20

export default async function Users({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>
}) {
  const params = await searchParams
  const page = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1)
  const q = (params.q ?? "").trim()
  const { users, departments, total, totalPages } = await getData(page, q)
  const currentPage = Math.min(page, totalPages)

  return (
    <div className="container mx-auto space-y-6 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Users</h1>

          <p className="text-muted-foreground">
            Manage application users and roles
          </p>
        </div>

        <AddUserDialog departments={departments} />
      </div>

      <UserTable
        users={users}
        departments={departments}
        total={total}
        currentPage={currentPage}
        totalPages={totalPages}
        query={q}
      />
    </div>
  )
}
