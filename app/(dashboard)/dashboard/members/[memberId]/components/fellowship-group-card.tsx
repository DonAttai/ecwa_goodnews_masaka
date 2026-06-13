import { prisma } from "@/lib/prisma"
import { Users } from "lucide-react"

interface FellowshipGroupCardProps {
  groupId: string
}

export async function FellowshipGroupCard({
  groupId,
}: FellowshipGroupCardProps) {
  const fellowship = await prisma.fellowshipGroup.findUnique({
    where: { id: groupId },
  })
  return (
    <div className="flex items-center justify-between rounded-lg border bg-card p-4 transition-all duration-200 hover:bg-accent/5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-emerald-500 to-teal-600 text-white">
          <Users className="h-5 w-5" />
        </div>
        <div>
          <p className="font-semibold">
            {(fellowship && fellowship.name) || "Unnamed Group"}
          </p>
        </div>
      </div>
    </div>
  )
}
