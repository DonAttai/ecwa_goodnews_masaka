import { describe, it, expect } from "vitest"
import { isAllowedUploadFolder, validateUploadFile } from "@/lib/cloudinary"
import { retryAfterHeaders } from "@/lib/rate-limit"

function fakeFile(type: string, size: number): File {
  return { type, size } as unknown as File
}

describe("upload folder allowlist ($0)", () => {
  it("allows top-level folders and nested paths", () => {
    expect(isAllowedUploadFolder("members")).toBe(true)
    expect(isAllowedUploadFolder("receipts/2026")).toBe(true)
  })

  it("rejects unknown folders", () => {
    expect(isAllowedUploadFolder("secrets")).toBe(false)
    expect(isAllowedUploadFolder("")).toBe(false)
  })
})

describe("retry-after headers", () => {
  it("emits Retry-After >= 1", () => {
    expect(retryAfterHeaders(0)["Retry-After"]).toBe("1")
    expect(retryAfterHeaders(42)["Retry-After"]).toBe("42")
  })
})

describe("validateUploadFile ($0 guards)", () => {
  it("rejects bad folder, bad mime, oversize", () => {
    expect(
      validateUploadFile(fakeFile("image/jpeg", 10), "secrets")
    ).toMatch(/Folder/)
    expect(
      validateUploadFile(fakeFile("video/mp4", 10), "members")
    ).toMatch(/Unsupported/)
    expect(
      validateUploadFile(fakeFile("image/jpeg", 6 * 1024 * 1024), "members")
    ).toMatch(/Max 5MB/)
    expect(
      validateUploadFile(fakeFile("image/jpeg", 10), "members")
    ).toBeNull()
  })
})
