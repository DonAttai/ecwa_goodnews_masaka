import {
  ArrowRight,
  Building2,
  Church,
  ClipboardList,
  Mail,
  User,
} from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface UserDashboardProps {
  user: {
    name: string
    email: string
    role: string
    createdAt?: Date
    department?: {
      id: string
      name: string
    } | null
  }
}

export default function UserDashboard({ user }: UserDashboardProps) {
  const greeting = (() => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 17) return "Good afternoon"
    return "Good evening"
  })()

  const formatDate = (date?: Date) => {
    if (!date) return "Recently"
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    })
  }

  const departmentName = user.department?.name || "N/A"

  const quickActions = [
    {
      title: "View Profile",
      description: "Update your personal information and contact details.",
      href: "/dashboard/profile",
      icon: User,
      accent: "bg-primary/10 text-primary",
    },
    {
      title: "Requisitions",
      description: "Track requests and church-related submissions.",
      href: "/dashboard/requisitions",
      icon: ClipboardList,
      accent: "bg-amber-500/10 text-amber-600",
    },
  ]

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-6">
      {/* Hero Section */}
      <section className="overflow-hidden rounded-3xl border border-[#e2dcd5]/70 bg-linear-to-br from-[#1a2332] via-[#22304a] to-[#2f4362] p-6 text-white shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-medium tracking-[0.25em] text-[#e8d5a3] uppercase">
              User dashboard
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              {greeting}, {user.name}
            </h1>
            <p className="mt-3 max-w-xl text-sm text-slate-200 sm:text-base">
              Welcome to your church dashboard. You can review your profile, and
              manage requests.
            </p>
          </div>
        </div>
      </section>

      {/* Info Cards - Updated to 4 cards with responsive grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-[#e2dcd5]/70 bg-white">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-primary/10 p-2">
                <Church className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Added since</p>
                <p className="text-lg font-semibold">
                  {formatDate(user.createdAt)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#e2dcd5]/70 bg-white">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-purple-500/10 p-2">
                <Mail className="h-5 w-5 text-purple-500" />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="truncate text-lg font-semibold">{user.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* New Department Card */}
        <Card className="border-[#e2dcd5]/70 bg-white">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-emerald-500/10 p-2">
                <Building2 className="h-5 w-5 text-emerald-600" />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-muted-foreground">Department</p>
                <p className="text-lg font-semibold">{departmentName}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rest of the dashboard remains unchanged */}
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-[#e2dcd5]/70 bg-white">
          <CardHeader>
            <CardTitle>Quick actions</CardTitle>
            <CardDescription>
              Jump straight into the areas that matter most for your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <Button
                  asChild
                  key={action.title}
                  variant="outline"
                  className="h-auto justify-start rounded-2xl border-[#e2dcd5] p-4 text-left transition-colors hover:bg-muted/50"
                >
                  <Link
                    href={action.href}
                    className="flex w-full items-start gap-3"
                  >
                    <div
                      className={`rounded-lg p-2.5 ${action.accent} shrink-0`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-[#1a2332]">
                        {action.title}
                      </span>
                      <span className="mt-1 line-clamp-2 block text-xs text-muted-foreground">
                        {action.description}
                      </span>
                    </div>
                    <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
                  </Link>
                </Button>
              )
            })}
          </CardContent>
        </Card>

        <Card className="border-[#e2dcd5]/70 bg-white">
          <CardHeader>
            <CardTitle>What you can do here</CardTitle>
            <CardDescription>
              Everything you need as a member is gathered in one place.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              "Keep your profile details current",
              "Review and manage your requisitions",
              "Stay informed through the dashboard experience",
            ].map((item) => (
              <div
                key={item}
                className="flex items-start gap-2 rounded-xl bg-[#f8f6f3] p-3 text-sm text-[#4a5568]"
              >
                <div className="mt-0.5 h-2 w-2 rounded-full bg-[#c9a84c]" />
                <span>{item}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
