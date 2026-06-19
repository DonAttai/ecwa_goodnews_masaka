import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"
import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json()

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
