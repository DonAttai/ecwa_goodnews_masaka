import { NextResponse } from "next/server"
import { getPublicEvents, getPublicSermons } from "@/lib/site"

export async function GET(req: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params
  if (slug === "sermons") return NextResponse.json(await getPublicSermons())
  if (slug === "events") return NextResponse.json(await getPublicEvents())
  return NextResponse.json({ error: "Not found" }, { status: 404 })
}
