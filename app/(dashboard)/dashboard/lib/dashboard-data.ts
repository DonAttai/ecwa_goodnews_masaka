import { prisma } from "@/lib/prisma"
import { Role } from "@/lib/prisma"
import { startOfMonth, subMonths, format } from "date-fns"

export interface MembershipChartData {
  month: string
  members: number
}

export interface GenderDistribution {
  label: string
  value: number
  color: string
}

export interface TrendData {
  current: number
  previous: number
  change: number
}

export interface DashboardAnalytics {
  isAdmin: boolean
  newMembersThisMonth: number
  activeRequisitions: number
  pendingRequisitions: number
  departments: number
  membershipChart: MembershipChartData[]
  genderDistribution: GenderDistribution[]
  trends: {
    totalMembers: TrendData
    maleMembers: TrendData
    femaleMembers: TrendData
    children: TrendData
  }
}

/**
 * Fetches staff dashboard analytics.
 *
 * Role-based access control:
 * - Admin-only data (membership trend chart, gender distribution, requisition
 *   activity, gender/children breakdown) is only queried and returned for
 *   ADMIN users.
 * - Non-admin staff (FINANCE/WORKER) only receive aggregate member counts and
 *   are explicitly marked with `isAdmin: false` so the UI can hide any
 *   admin-only widgets.
 */
export async function getDashboardAnalytics(
  role: Role
): Promise<DashboardAnalytics> {
  const isAdmin = role === Role.ADMIN
  const now = new Date()
  const startOfCurrentMonth = startOfMonth(now)
  const startOfPreviousMonth = startOfMonth(subMonths(now, 1))

  const [
    totalMembers,
    newMembersThisMonth,
    ,
    departments,
  ] = await Promise.all([
    prisma.member.count(),
    prisma.member.count({ where: { createdAt: { gte: startOfCurrentMonth } } }),
    prisma.member.count({
      where: {
        createdAt: { gte: startOfPreviousMonth, lt: startOfCurrentMonth },
      },
    }),
    prisma.department.count(),
  ])

  // ---- Admin-only data ----
  const isAdminQueries = isAdmin
    ? Promise.all([
        prisma.member.count({ where: { gender: "MALE" } }),
        prisma.member.count({ where: { gender: "FEMALE" } }),
        prisma.child.count(),
        prisma.requisition.count({
          where: { status: { in: ["SUBMITTED", "APPROVED"] } },
        }),
        prisma.requisition.count({ where: { status: "SUBMITTED" } }),
        prisma.member.findMany({
          where: { createdAt: { gte: subMonths(now, 12) } },
          select: { createdAt: true },
        }),
      ])
    : Promise.resolve(null)

  const adminData = await isAdminQueries

  if (!isAdmin || !adminData) {
    return {
      isAdmin: false,
      newMembersThisMonth,
      activeRequisitions: 0,
      pendingRequisitions: 0,
      departments,
      membershipChart: [],
      genderDistribution: [],
      trends: {
        totalMembers: {
          current: totalMembers,
          previous: totalMembers - newMembersThisMonth,
          change: calculateTrend(
            totalMembers,
            totalMembers - newMembersThisMonth
          ),
        },
        maleMembers: { current: 0, previous: 0, change: 0 },
        femaleMembers: { current: 0, previous: 0, change: 0 },
        children: { current: 0, previous: 0, change: 0 },
      },
    }
  }

  const [
    maleCount,
    femaleCount,
    childrenCount,
    activeRequisitions,
    pendingRequisitions,
    membershipChartRaw,
  ] = adminData

  const monthlyCounts = new Map<string, number>()
  for (let i = 11; i >= 0; i--) {
    const date = subMonths(now, i)
    const key = format(date, "MMM yyyy")
    monthlyCounts.set(key, 0)
  }

  for (const member of membershipChartRaw) {
    const key = format(member.createdAt, "MMM yyyy")
    if (monthlyCounts.has(key)) {
      monthlyCounts.set(key, (monthlyCounts.get(key) ?? 0) + 1)
    }
  }

  const membershipChart: MembershipChartData[] = Array.from(
    monthlyCounts.entries()
  ).map(([month, members]) => ({ month, members }))

  const genderDistribution: GenderDistribution[] = [
    { label: "Male", value: maleCount, color: "var(--chart-2)" },
    { label: "Female", value: femaleCount, color: "var(--chart-3)" },
  ]

  return {
    isAdmin: true,
    newMembersThisMonth,
    activeRequisitions,
    pendingRequisitions,
    departments,
    membershipChart,
    genderDistribution,
    trends: {
      totalMembers: {
        current: totalMembers,
        previous: totalMembers - newMembersThisMonth,
        change: calculateTrend(
          totalMembers,
          totalMembers - newMembersThisMonth
        ),
      },
      maleMembers: {
        current: maleCount,
        previous: Math.max(maleCount - Math.round(maleCount * 0.05), 0),
        change: 0,
      },
      femaleMembers: {
        current: femaleCount,
        previous: Math.max(femaleCount - Math.round(femaleCount * 0.05), 0),
        change: 0,
      },
      children: {
        current: childrenCount,
        previous: Math.max(childrenCount - Math.round(childrenCount * 0.05), 0),
        change: 0,
      },
    },
  }
}

export interface FinanceDashboardData {
  totalMembers: number
  departments: number
  totalRequisitions: number
  pendingValue: number
  paidThisMonth: number
  totalRequisitionValue: number
  pendingApprovals: number
  requisitionCounts: {
    SUBMITTED: number
    APPROVED: number
    PAID: number
    COMPLETED: number
    REJECTED: number
  }
  needsAttention: {
    id: string
    title: string
    status: string
    priority: string
    createdAt: Date
    requestedBy: { name: string }
    amount: number | null
    currency: string
  }[]
  urgentItems: {
    id: string
    title: string
    status: string
    priority: string
    requestedBy: { name: string }
    amount: number | null
    currency: string
  }[]
  spendByDepartment: {
    name: string
    count: number
    total: number
    currency: string
  }[]
}

/**
 * FINANCE-scoped dashboard data.
 *
 * Finance staff work on the requisition workflow and its money flow, so this
 * returns real monetary figures (pending / paid / total value), requisition
 * counts by status, urgent high-priority items, spend by department, and the
 * requisitions needing attention. Only data relevant to finance is queried.
 */
export async function getFinanceDashboardData(): Promise<FinanceDashboardData> {
  const startOfCurrentMonth = startOfMonth(new Date())
  const [
    totalMembers,
    departments,
    totalRequisitions,
    submitted,
    approved,
    paid,
    completed,
    rejected,
    pendingAgg,
    paidThisMonthAgg,
    totalValueAgg,
    pendingApprovals,
    needsAttention,
    urgentItems,
    departmentGroups,
  ] = await Promise.all([
    prisma.member.count(),
    prisma.department.count(),
    prisma.requisition.count(),
    prisma.requisition.count({ where: { status: "SUBMITTED" } }),
    prisma.requisition.count({ where: { status: "APPROVED" } }),
    prisma.requisition.count({ where: { status: "PAID" } }),
    prisma.requisition.count({ where: { status: "COMPLETED" } }),
    prisma.requisition.count({ where: { status: "REJECTED" } }),
    prisma.requisition.aggregate({
      where: { status: { in: ["SUBMITTED", "APPROVED"] } },
      _sum: { amount: true },
    }),
    prisma.requisition.aggregate({
      where: {
        status: "PAID",
        paidAt: { gte: startOfCurrentMonth },
      },
      _sum: { amount: true },
    }),
    prisma.requisition.aggregate({
      _sum: { amount: true },
    }),
    prisma.requisition.count({ where: { status: "SUBMITTED" } }),
    prisma.requisition.findMany({
      where: { status: { in: ["SUBMITTED", "APPROVED", "PAID"] } },
      orderBy: { createdAt: "asc" },
      take: 5,
      select: {
        id: true,
        title: true,
        status: true,
        priority: true,
        createdAt: true,
        amount: true,
        currency: true,
        requestedBy: { select: { name: true } },
      },
    }),
    prisma.requisition.findMany({
      where: { priority: { in: ["HIGH", "URGENT"] } },
      orderBy: { createdAt: "desc" },
      take: 4,
      select: {
        id: true,
        title: true,
        status: true,
        priority: true,
        amount: true,
        currency: true,
        requestedBy: { select: { name: true } },
      },
    }),
    prisma.requisition.groupBy({
      by: ["departmentId"],
      _count: { _all: true },
      _sum: { amount: true },
      where: { departmentId: { not: null } },
    }),
  ])

  const departmentsById = await prisma.department.findMany({
    where: { id: { in: departmentGroups.map((d) => d.departmentId!) } },
    select: { id: true, name: true },
  })

  const spendByDepartment = departmentGroups
    .map((group) => {
      const dept = departmentsById.find((d) => d.id === group.departmentId)
      return {
        name: dept?.name ?? "Unassigned",
        count: group._count._all,
        total: group._sum.amount !== null ? Number(group._sum.amount) : 0,
        currency: "NGN",
      }
    })
    .sort((a, b) => b.total - a.total)
    .slice(0, 5)

  return {
    totalMembers,
    departments,
    totalRequisitions,
    pendingValue:
      pendingAgg._sum.amount !== null && pendingAgg._sum.amount !== undefined
        ? Number(pendingAgg._sum.amount)
        : 0,
    paidThisMonth:
      paidThisMonthAgg._sum.amount !== null &&
      paidThisMonthAgg._sum.amount !== undefined
        ? Number(paidThisMonthAgg._sum.amount)
        : 0,
    totalRequisitionValue:
      totalValueAgg._sum.amount !== null &&
      totalValueAgg._sum.amount !== undefined
        ? Number(totalValueAgg._sum.amount)
        : 0,
    pendingApprovals,
    requisitionCounts: {
      SUBMITTED: submitted,
      APPROVED: approved,
      PAID: paid,
      COMPLETED: completed,
      REJECTED: rejected,
    },
    needsAttention: needsAttention.map((req) => ({
      id: req.id,
      title: req.title,
      status: req.status,
      priority: req.priority,
      createdAt: req.createdAt,
      requestedBy: req.requestedBy,
      amount: req.amount !== null ? Number(req.amount) : null,
      currency: req.currency,
    })),
    urgentItems: urgentItems.map((req) => ({
      id: req.id,
      title: req.title,
      status: req.status,
      priority: req.priority,
      requestedBy: req.requestedBy,
      amount: req.amount !== null ? Number(req.amount) : null,
      currency: req.currency,
    })),
    spendByDepartment,
  }
}

export interface WorkerDashboardData {
  totalMembers: number
  newMembersThisMonth: number
  departments: number
  maleCount: number
  femaleCount: number
  childrenCount: number
  fellowships: {
    id: string
    name: string
    memberCount: number
  }[]
  zones: {
    name: string
    count: number
  }[]
}

/**
 * WORKER-scoped dashboard data.
 *
 * Workers are frontline staff who interact directly with the congregation.
 * They get an operations/outreach overview: member totals (including gender
 * and children breakdown), fellowship groups with member counts, and a zone
 * distribution. Recent activity (audit log) is intentionally excluded - it is
 * admin-only.
 */
export async function getWorkerDashboardData(): Promise<WorkerDashboardData> {
  const startOfCurrentMonth = startOfMonth(new Date())
  const [
    totalMembers,
    newMembersThisMonth,
    departments,
    maleCount,
    femaleCount,
    childrenCount,
    fellowships,
    membersWithZones,
  ] = await Promise.all([
    prisma.member.count(),
    prisma.member.count({ where: { createdAt: { gte: startOfCurrentMonth } } }),
    prisma.department.count(),
    prisma.member.count({ where: { gender: "MALE" } }),
    prisma.member.count({ where: { gender: "FEMALE" } }),
    prisma.child.count(),
    prisma.fellowshipGroup.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        _count: { select: { members: true } },
      },
    }),
    prisma.member.findMany({
      where: { zone: { not: null } },
      select: { zone: true },
    }),
  ])

  const zoneMap = new Map<string, number>()
  for (const m of membersWithZones) {
    const z = m.zone ?? "Unassigned"
    zoneMap.set(z, (zoneMap.get(z) ?? 0) + 1)
  }
  const zones = Array.from(zoneMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6)

  return {
    totalMembers,
    newMembersThisMonth,
    departments,
    maleCount,
    femaleCount,
    childrenCount,
    fellowships: fellowships.map((f) => ({
      id: f.id,
      name: f.name,
      memberCount: f._count.members,
    })),
    zones,
  }
}

function calculateTrend(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0
  return Math.round(((current - previous) / previous) * 100)
}
