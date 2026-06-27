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
    bg: "bg-[#c9a84c]/10",
    text: "text-[#c9a84c]",
    border: "border-[#c9a84c]/20",
    hover: "hover:shadow-[#c9a84c]/10",
  },
  blue: {
    bg: "bg-blue-500/10",
    text: "text-blue-500",
    border: "border-blue-500/20",
    hover: "hover:shadow-blue-500/10",
  },
  rose: {
    bg: "bg-rose-500/10",
    text: "text-rose-500",
    border: "border-rose-500/20",
    hover: "hover:shadow-rose-500/10",
  },
  emerald: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-500",
    border: "border-emerald-500/20",
    hover: "hover:shadow-emerald-500/10",
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
        "group relative overflow-hidden border-[#e2dcd5]/50 bg-white shadow-sm transition-all duration-300",
        "hover:-translate-y-0.5 hover:shadow-lg",
        colors.hover
      )}
    >
      {/* Decorative top bar with color */}
      <div
        className={cn(
          "absolute top-0 left-0 h-1 w-12 transition-all duration-300 group-hover:w-16",
          color === "gold" && "bg-linear-to-r from-[#c9a84c] to-[#e8d5a3]",
          color === "blue" && "bg-linear-to-r from-blue-500 to-blue-400",
          color === "rose" && "bg-linear-to-r from-rose-500 to-rose-400",
          color === "emerald" &&
            "bg-linear-to-r from-emerald-500 to-emerald-400"
        )}
      />

      <CardHeader className="flex flex-row items-center justify-between space-y-0 pt-4 pb-2">
        <CardTitle className="text-sm font-medium text-[#8a95a8]">
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
            <div className="text-2xl font-bold tracking-tight text-[#1a2332]">
              {value}
            </div>
            {description && (
              <p className="mt-0.5 text-xs text-[#8a95a8]">{description}</p>
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
