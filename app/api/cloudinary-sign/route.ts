import { v2 as cloudinary } from "cloudinary"
import { NextResponse } from "next/server"
import { z } from "zod"
import { getCurrentUser } from "@/app/actions/auth"
import { getClientIp, rateLimit } from "@/lib/rate-limit"

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// $0 hardening: auth-required signed uploads with folder allowlist +
// in-memory rate limit (single-node documented in lib/rate-limit.ts).
// No Upstash/Redis so this stays free on Vercel Hobby forever.
//
// Any authenticated dashboard user may sign uploads: requisition receipts
// are filed by dept heads (WORKER), passports by ADMIN/EDITOR, site assets
// by ADMIN/EDITOR. Session + rate limit + folder allowlist are the guards.
const ALLOWED_FOLDERS = [
  "members",
  "events",
  "sermons",
  "gallery",
  "receipts",
  "requisitions",
] as const

const signSchema = z.object({
  paramsToSign: z.record(z.string(), z.union([z.string(), z.number()])),
})

export async function POST(request: Request) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const ip = await getClientIp()
  const throttled = rateLimit({
    key: `cloudinary-sign:${user.id}:${ip}`,
    limit: 30,
    windowMs: 60 * 60 * 1000,
  })
  if (!throttled.ok) {
    return NextResponse.json(
      { error: "Too many requests. Try again later." },
      { status: 429 }
    )
  }

  const parsed = signSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Missing paramsToSign" },
      { status: 400 }
    )
  }

  const { paramsToSign } = parsed.data
  const folder = paramsToSign.folder

  if (typeof folder === "string" && folder.length > 0) {
    const topLevel = folder.split("/")[0]
    if (!(ALLOWED_FOLDERS as readonly string[]).includes(topLevel)) {
      return NextResponse.json({ error: "Folder not allowed" }, { status: 400 })
    }
  }

  if (!process.env.CLOUDINARY_API_SECRET) {
    return NextResponse.json(
      { error: "Uploads not configured" },
      { status: 500 }
    )
  }

  try {
    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET
    )
    return NextResponse.json({ signature })
  } catch (error) {
    console.error("Signature generation error:", error)
    return NextResponse.json(
      { error: "Failed to generate signature" },
      { status: 500 }
    )
  }
}
