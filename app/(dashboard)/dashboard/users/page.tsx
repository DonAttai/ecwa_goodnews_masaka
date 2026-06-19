import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { columns, User } from "./columns"
import { DataTable } from "./data-table"
import { prisma } from "@/lib/prisma"
import AddUserDialog from "./components/add-user-dialog"

async function getData(): Promise<User[]> {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  if (session?.role !== "ADMIN") {
    redirect("/dashboard")
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return users
}

export default async function Users() {
  const data = await getData()

  return (
    <div className="container mx-auto space-y-6 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Users</h1>

          <p className="text-muted-foreground">
            Manage application users and roles
          </p>
        </div>

        <AddUserDialog />
      </div>

      <DataTable columns={columns} data={data} />
    </div>
  )
}
