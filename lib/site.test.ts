import { describe, it, expect } from "vitest"
import {
  getYouTubeId,
  toYouTubeEmbed,
  sermonThumbnail,
} from "@/lib/site"

describe("getYouTubeId", () => {
  it("parses watch URLs", () => {
    expect(getYouTubeId("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe(
      "dQw4w9WgXcQ"
    )
  })

  it("parses youtu.be share URLs", () => {
    expect(getYouTubeId("https://youtu.be/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ")
  })

  it("parses embed / live / shorts URLs", () => {
    expect(getYouTubeId("https://www.youtube.com/embed/dQw4w9WgXcQ")).toBe(
      "dQw4w9WgXcQ"
    )
    expect(getYouTubeId("https://www.youtube.com/live/dQw4w9WgXcQ")).toBe(
      "dQw4w9WgXcQ"
    )
    expect(getYouTubeId("https://www.youtube.com/shorts/dQw4w9WgXcQ")).toBe(
      "dQw4w9WgXcQ"
    )
  })

  it("returns null for invalid URLs", () => {
    expect(getYouTubeId("not a url")).toBeNull()
    expect(getYouTubeId("https://example.com/video")).toBeNull()
  })
})

describe("toYouTubeEmbed", () => {
  it("converts watch URLs to embed", () => {
    expect(toYouTubeEmbed("https://www.youtube.com/watch?v=abc123")).toBe(
      "https://www.youtube.com/embed/abc123"
    )
  })

  it("returns null for unknown hosts", () => {
    expect(toYouTubeEmbed("https://example.com/x")).toBeNull()
  })
})

describe("sermonThumbnail", () => {
  it("returns hqdefault thumbnail for YouTube sermons", () => {
    expect(sermonThumbnail("https://youtu.be/dQw4w9WgXcQ")).toBe(
      "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg"
    )
  })

  it("returns null without URL", () => {
    expect(sermonThumbnail(undefined)).toBeNull()
  })
})
