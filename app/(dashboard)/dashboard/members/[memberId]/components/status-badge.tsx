import { Badge } from "@/components/ui/badge"

interface StatusBadgeProps {
  label: "YES" | "NO"
  showIcon?: boolean
}

export function StatusBadge({ label, showIcon = false }: StatusBadgeProps) {
  const isYes = label === "YES"
  return (
    <Badge
      className={`${
        isYes
          ? "bg-emerald-500 hover:bg-emerald-600"
          : "bg-rose-500 hover:bg-rose-600"
      } transition-all duration-200`}
    >
      {showIcon && (isYes ? "✓" : "✗")} {label}
    </Badge>
  )
}
