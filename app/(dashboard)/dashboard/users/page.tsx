import { redirect } from "next/navigation"
import { columns, User } from "./columns"
import { DataTable } from "./data-table"
import { prisma, Role } from "@/lib/prisma"
import AddUserDialog from "./components/add-user-dialog"
import { getAllUsers, getCurrentUser } from "@/app/actions/auth"
import { getDepartments } from "../settings/actions/department"

async function getData(): Promise<{
  users: User[]
  departments: Array<{ id: string; name: string }>
}> {
  const user = await getCurrentUser()

  if (!user) redirect("/login")

  if (user?.role !== "ADMIN") redirect("/dashboard")

  const [users, departments] = await Promise.all([
    getAllUsers(),
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
  }
}

export default async function Users() {
  const { users, departments } = await getData()

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

      <DataTable columns={columns} data={users} />
    </div>
  )
}
