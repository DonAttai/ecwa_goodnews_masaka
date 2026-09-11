import { describe, it, expect } from "vitest"
import { Role } from "@/generated/prisma/enums"
import { createUserSchema } from "@/app/(dashboard)/dashboard/users/schemas"
import { requisitionStatusPermissions } from "@/app/(dashboard)/dashboard/requisitions/permissions"

// Gate matrix for the EDITOR role: content + member registration only.
// No admin privileges, no requisitions, no user management.
describe("EDITOR role gates", () => {
  it("exists in the Role enum", () => {
    expect(Object.values(Role)).toContain("EDITOR")
  })

  it("can be assigned with a department", () => {
    const parsed = createUserSchema.safeParse({
      name: "Content Editor",
      email: "editor@example.com",
      role: "EDITOR",
      departmentId: "dept-1",
    })
    expect(parsed.success).toBe(true)
  })

  it("requires a department like other staff roles", () => {
    const parsed = createUserSchema.safeParse({
      name: "Content Editor",
      email: "editor@example.com",
      role: "EDITOR",
    })
    expect(parsed.success).toBe(false)
  })

  it("has no requisition status permissions", () => {
    for (const roles of Object.values(requisitionStatusPermissions)) {
      expect(roles).not.toContain(Role.EDITOR)
    }
  })

  it("role set is exactly ADMIN, FINANCE, ELDER, WORKER, PASTOR, EDITOR", () => {
    expect(Object.values(Role).sort()).toEqual(
      ["ADMIN", "EDITOR", "ELDER", "FINANCE", "PASTOR", "WORKER"].sort()
    )
  })

  it("PASTOR has no requisition status permissions and needs a department", () => {
    for (const roles of Object.values(requisitionStatusPermissions)) {
      expect(roles).not.toContain(Role.PASTOR)
    }
    expect(
      createUserSchema.safeParse({
        name: "Pastor User",
        email: "pastor@example.com",
        role: "PASTOR",
      }).success
    ).toBe(false)
    expect(
      createUserSchema.safeParse({
        name: "Pastor User",
        email: "pastor@example.com",
        role: "PASTOR",
        departmentId: "dept-1",
      }).success
    ).toBe(true)
  })

  it("requires a department for ADMIN too", () => {
    const missing = createUserSchema.safeParse({
      name: "Admin User",
      email: "admin@example.com",
      role: "ADMIN",
    })
    expect(missing.success).toBe(false)

    const provided = createUserSchema.safeParse({
      name: "Admin User",
      email: "admin@example.com",
      role: "ADMIN",
      departmentId: "dept-1",
    })
    expect(provided.success).toBe(true)
  })
})
