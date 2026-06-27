import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"

export default function AnalyticsCard() {
  return (
    <Card className="overflow-hidden border-[#e2dcd5]/50 shadow-sm transition-all duration-300 hover:shadow-md lg:col-span-2">
      <div className="relative">
        {/* Gold top accent */}
        <div className="absolute top-0 left-0 h-1 w-20 bg-linear-to-r from-[#c9a84c] to-[#e8d5a3]" />

        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-[#1a2332]">
              Analytics Overview
            </CardTitle>
            <button className="text-xs font-medium text-[#c9a84c] transition-colors hover:text-[#b8973e]">
              View All →
            </button>
          </div>
          <p className="text-sm text-[#8a95a8]">
            Church growth and attendance trends
          </p>
        </CardHeader>

        <CardContent>
          <div className="flex h-50 items-center justify-center rounded-xl bg-[#f8f6f3]">
            <div className="text-center">
              <TrendingUp className="mx-auto h-12 w-12 text-[#c9a84c]/30" />
              <p className="mt-2 text-sm text-[#8a95a8]">Chart coming soon</p>
              <p className="text-xs text-[#8a95a8]/60">
                Monthly attendance & growth data
              </p>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}
