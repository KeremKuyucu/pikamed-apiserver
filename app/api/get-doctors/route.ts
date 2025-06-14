import { type NextRequest, NextResponse } from "next/server"
import { withAuth, type AuthenticatedRequest } from "@/lib/auth-middleware"
import { adminAuth } from "@/lib/firebase-admin"

async function handler(request: AuthenticatedRequest) {
  try {
    // Firebase Authentication kullanıcılarını listele
    const listUsersResult = await adminAuth.listUsers()
    const doctors = listUsersResult.users
      .filter((user) => user.customClaims?.role === "doctor")
      .map((user) => ({
        email: user.email,
        fullName: user.displayName,
      }))

    return NextResponse.json({
      success: true,
      doctors,
    })
  } catch (error) {
    console.error("Get doctors error:", error)
    return NextResponse.json(
      {
        success: false,
        message: `Hata: ${error}`,
      },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  return withAuth("admin")(request as AuthenticatedRequest, handler)
}
