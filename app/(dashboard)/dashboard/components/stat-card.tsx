import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"

export interface StatCardProps {
  title: string
  value: string | number
  trend?: string
  trendUp?: boolean
  icon: React.ReactNode
  description?: string
  color?: "gold" | "blue" | "rose" | "emerald"
}

const colorClasses = {
  gold: {
    bg: "bg-primary/10",
    text: "text-primary",
    border: "border-primary/20",
    hover: "hover:shadow-primary/10",
    bar: "bg-linear-to-r from-primary to-[#e8d5a3]",
  },
  blue: {
    bg: "bg-blue-500/10",
    text: "text-blue-500",
    border: "border-blue-500/20",
    hover: "hover:shadow-blue-500/10",
    bar: "bg-linear-to-r from-blue-500 to-blue-400",
  },
  rose: {
    bg: "bg-rose-500/10",
    text: "text-rose-500",
    border: "border-rose-500/20",
    hover: "hover:shadow-rose-500/10",
    bar: "bg-linear-to-r from-rose-500 to-rose-400",
  },
  emerald: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-500",
    border: "border-emerald-500/20",
    hover: "hover:shadow-emerald-500/10",
    bar: "bg-linear-to-r from-emerald-500 to-emerald-400",
  },
}

export function StatCard({
  title,
  value,
  trend,
  trendUp = true,
  icon,
  description,
  color = "gold",
}: StatCardProps) {
  const colors = colorClasses[color]

  return (
    <Card
      className={cn(
        "group relative overflow-hidden border-border bg-card shadow-sm transition-all duration-300",
        "hover:-translate-y-0.5 hover:shadow-lg",
        colors.hover
      )}
    >
      {/* Decorative top bar with color */}
      <div
        className={cn(
          "absolute top-0 left-0 h-1 w-12 transition-all duration-300 group-hover:w-16",
          colors.bar
        )}
      />

      <CardHeader className="flex flex-row items-center justify-between space-y-0 pt-4 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>

        <div
          className={cn(
            "rounded-xl p-2.5 transition-all duration-300",
            colors.bg,
            colors.text,
            "group-hover:scale-110 group-hover:rotate-3"
          )}
        >
          {icon}
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex items-end justify-between">
          <div>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {value}
            </div>
            {description && (
              <p className="mt-0.5 text-xs text-muted-foreground">
                {description}
              </p>
            )}
          </div>

          {trend && (
            <div
              className={cn(
                "flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium",
                trendUp
                  ? "bg-emerald-500/10 text-emerald-600"
                  : "bg-rose-500/10 text-rose-600"
              )}
            >
              {trendUp ? (
                <ArrowUpRight className="h-3 w-3" />
              ) : (
                <ArrowDownRight className="h-3 w-3" />
              )}
              {trend}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
