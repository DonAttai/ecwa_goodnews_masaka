import { describe, it, expect } from "vitest"
import { toFaceThumb } from "./cloudinary-url"

const CLOUD_URL =
  "https://res.cloudinary.com/demo/image/upload/v123/members/photo.jpg"

describe("toFaceThumb", () => {
  it("injects a face-aware square transform into Cloudinary URLs", () => {
    expect(toFaceThumb(CLOUD_URL, 256)).toBe(
      "https://res.cloudinary.com/demo/image/upload/c_thumb,g_face,z_0.8,w_256,h_256/v123/members/photo.jpg"
    )
  })

  it("passes non-Cloudinary URLs through untouched", () => {
    const external = "https://example.com/p.jpg"
    expect(toFaceThumb(external)).toBe(external)
  })

  it("passes nullish values through", () => {
    expect(toFaceThumb(null)).toBeNull()
    expect(toFaceThumb(undefined)).toBeUndefined()
    expect(toFaceThumb("")).toBe("")
  })

  it("does not double-transform", () => {
    const once = toFaceThumb(CLOUD_URL) as string
    expect(toFaceThumb(once)).toBe(once)
  })
})
