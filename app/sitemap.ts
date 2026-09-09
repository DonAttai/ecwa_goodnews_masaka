import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://ecwagoodnewsmasaka.org"
  const pages = [
    "",
    "/about",
    "/ministries",
    "/sermons",
    "/events",
    "/gallery",
    "/give",
    "/contact",
  ]
  return pages.map((p) => ({
    url: `${base}${p}`,
    lastModified: new Date(),
    changeFrequency: p === "" ? "daily" : "weekly",
    priority: p === "" ? 1 : 0.7,
  }))
}
