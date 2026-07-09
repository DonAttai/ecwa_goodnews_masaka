import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const DEFAULT_BADGE_CLASS = "border-gray-200 bg-gray-50 text-gray-700"

type ValueBadgeProps = {
  value: string
  classes: Record<string, string>
}

export function ValueBadge({ value, classes }: ValueBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(classes[value] ?? DEFAULT_BADGE_CLASS)}
    >
      {value}
    </Badge>
  )
}
