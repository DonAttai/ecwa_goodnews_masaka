import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"
import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"
import { getClientIp, rateLimit } from "@/lib/rate-limit"

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json()

    const clientIp = await getClientIp()
    const throttled = rateLimit({
      key: `set-password:${token}:${clientIp}`,
      limit: 5,
      windowMs: 60 * 60 * 1000,
    })

    if (!throttled.ok) {
      return NextResponse.json(
        {
          message: "Too many attempts. Try again later.",
        },
        {
          status: 429,
          headers: { "Retry-After": String(throttled.retryAfterSec) },
        }
      )
    }

    const setupToken = await prisma.passwordSetupToken.findUnique({
      where: {
        token,
      },
    })

    if (!setupToken) {
      return NextResponse.json(
        {
          message: "Invalid token",
        },
        {
          status: 400,
        }
      )
    }

    if (setupToken.expiresAt < new Date()) {
      return NextResponse.json(
        {
          message: "Token expired",
        },
        {
          status: 400,
        }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    await prisma.user.update({
      where: {
        id: setupToken.userId,
      },
      data: {
        password: hashedPassword,
        mustChangePassword: false,
        isActive: true,
      },
    })

    await prisma.passwordSetupToken.delete({
      where: {
        id: setupToken.id,
      },
    })
    revalidatePath("/dashboard/users")
    return NextResponse.json({
      success: true,
    })
  } catch {
    return NextResponse.json(
      {
        message: "Something went wrong",
      },
      {
        status: 500,
      }
    )
  }
}
