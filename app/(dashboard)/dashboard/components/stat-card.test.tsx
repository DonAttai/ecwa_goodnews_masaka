import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { Users } from "lucide-react"
import { StatCard } from "./stat-card"

describe("StatCard", () => {
  it("renders title, value and description", () => {
    render(
      <StatCard
        title="Total Members"
        value={42}
        description="All registered members"
        icon={<Users data-testid="stat-icon" />}
      />
    )

    expect(screen.getByText("Total Members")).toBeInTheDocument()
    expect(screen.getByText("42")).toBeInTheDocument()
    expect(screen.getByText("All registered members")).toBeInTheDocument()
  })

  it("renders an upward trend when provided", () => {
    render(
      <StatCard
        title="Total Members"
        value={42}
        trend="+12%"
        trendUp
        icon={<Users />}
      />
    )

    expect(screen.getByText("+12%")).toBeInTheDocument()
  })

  it("does not render a trend when none is provided", () => {
    render(<StatCard title="Total Members" value={42} icon={<Users />} />)

    expect(screen.queryByText(/\+/)).not.toBeInTheDocument()
  })
})
