import { NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth-edge"

const COOKIE_NAME = process.env.COOKIE_NAME || "session"
const PUBLIC_PATHS = ["/login", "/register"]
const PROTECTED_PATHS = ["/dashboard"]

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public paths
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // Check for protected routes
  if (PROTECTED_PATHS.some((path) => pathname.startsWith(path))) {
    // Read cookie using Next.js Request API
    const token = request.cookies.get(COOKIE_NAME)?.value

    if (!token) {
      if (pathname.startsWith("/api")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
      return NextResponse.redirect(new URL("/login", request.url))
    }

    const payload = verifyToken(token)

    if (!payload) {
      if (pathname.startsWith("/api")) {
        return NextResponse.json(
          { error: "Invalid or expired token" },
          { status: 401 }
        )
      }
      return NextResponse.redirect(new URL("/login", request.url))
    }

    // Add user info to headers for API routes
    const response = NextResponse.next()
    response.headers.set("X-User-Id", payload.userId)
    response.headers.set("X-User-Email", payload.email)
    response.headers.set("X-User-Role", payload.role)

    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"],
}
