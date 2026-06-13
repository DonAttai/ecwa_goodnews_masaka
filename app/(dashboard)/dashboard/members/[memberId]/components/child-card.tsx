import { Heart } from "lucide-react"

interface Child {
  id?: string
  name: string
  contact?: string
}

interface ChildCardProps {
  child: Child
}

export function ChildCard({ child }: ChildCardProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border bg-card p-4 transition-all duration-200 hover:bg-accent/5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-purple-600 text-white">
          <Heart className="h-5 w-5" />
        </div>
        <div>
          <p className="font-semibold">{child.name || "Unnamed"}</p>
        </div>
      </div>
    </div>
  )
}
