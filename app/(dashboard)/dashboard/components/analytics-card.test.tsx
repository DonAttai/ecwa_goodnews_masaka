import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import AnalyticsCard from "./analytics-card"

describe("AnalyticsCard", () => {
  it("renders the analytics stat values", () => {
    render(
      <AnalyticsCard
        newMembersThisMonth={5}
        activeRequisitions={10}
        pendingRequisitions={3}
        departments={7}
      />
    )

    expect(screen.getByText("Analytics Overview")).toBeInTheDocument()
    expect(screen.getByText("5")).toBeInTheDocument()
    expect(screen.getByText("10")).toBeInTheDocument()
    expect(screen.getByText("3")).toBeInTheDocument()
    expect(screen.getByText("7")).toBeInTheDocument()
  })

  it("hides charts when no chart data is provided", () => {
    render(<AnalyticsCard />)

    expect(
      screen.queryByText("Membership Growth (12 Months)")
    ).not.toBeInTheDocument()
  })
})
