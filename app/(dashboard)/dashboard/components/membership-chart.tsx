"use client"

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Legend,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface MembershipChartProps {
  data: { month: string; members: number }[]
  genderData: { label: string; value: number; color: string }[]
}

export function MembershipChart({ data, genderData }: MembershipChartProps) {
  const chartColors = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
  ]

  const coloredGenderData = genderData.map((entry, index) => ({
    ...entry,
    fill:
      entry.color || chartColors[index % chartColors.length],
  }))

  // Filter out 0-value entries so a single-gender dataset (e.g. Female 100%)
  // doesn't render a 0° slice with a misleading label
  const filteredGenderData = coloredGenderData.filter((d) => d.value > 0)
  const pieData =
    filteredGenderData.length > 0 ? filteredGenderData : coloredGenderData

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="border-border bg-card shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold text-foreground">
            Membership Growth (12 Months)
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            New members registered per month
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorMembers" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--chart-1)"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--chart-1)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                  axisLine={{ stroke: "hsl(var(--border))" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  labelStyle={{ color: "hsl(var(--foreground))" }}
                />
                <Area
                  type="monotone"
                  dataKey="members"
                  stroke="var(--chart-1)"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorMembers)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold text-foreground">
            Gender Distribution
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Current member gender breakdown
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex h-64 flex-col items-center overflow-visible">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ left: 40, right: 24, top: 8, bottom: 8 }}>
                <Pie
                  data={pieData}
                  cx="52%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={75}
                  paddingAngle={2}
                  dataKey="value"
                  nameKey="label"
                  label={({ payload, percent }) =>
                    `${payload?.label ?? ""} ${((percent ?? 0) * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                />
                <Legend
                  layout="vertical"
                  position="right"
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => value}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
