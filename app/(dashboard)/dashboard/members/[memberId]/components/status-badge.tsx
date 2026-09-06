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
          ? "bg-emerald-500 text-white hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500"
          : "bg-rose-500 text-white hover:bg-rose-600 dark:bg-rose-600 dark:hover:bg-rose-500"
      } transition-all duration-200`}
    >
      {showIcon && (isYes ? "✓" : "✗")} {label}
    </Badge>
  )
}
