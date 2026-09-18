import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  // .env.example defines NEXT_PUBLIC_APP_URL; accept SITE_URL as alias.
  const base =
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://ecwagoodnewsmasaka.org"
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
