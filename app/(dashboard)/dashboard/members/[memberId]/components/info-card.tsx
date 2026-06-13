import { LucideIcon } from "lucide-react"

interface InfoCardProps {
  icon?: LucideIcon
  label: string
  value: string | null | undefined
  className?: string
}

export function InfoCard({
  icon: Icon,
  label,
  value,
  className = "",
}: InfoCardProps) {
  const displayValue = value && value !== "null" ? String(value) : "N/A"

  return (
    <div
      className={`group rounded-lg border bg-card p-4 transition-all duration-200 hover:shadow-md ${className}`}
    >
      <div className="flex items-start gap-3">
        {Icon && (
          <div className="rounded-full bg-primary/10 p-2 text-primary transition-all duration-200 group-hover:bg-primary group-hover:text-primary-foreground">
            <Icon className="h-4 w-4" />
          </div>
        )}
        <div className="flex-1 space-y-1">
          <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
            {label}
          </p>
          <p className="text-sm leading-tight font-semibold wrap-break-word text-black dark:text-white">
            {displayValue}
          </p>
        </div>
      </div>
    </div>
  )
}
