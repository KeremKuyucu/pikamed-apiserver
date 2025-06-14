import { type NextRequest, NextResponse } from "next/server"
import { withAuth, type AuthenticatedRequest } from "@/lib/auth-middleware"
import { adminAuth } from "@/lib/firebase-admin"

async function handler(request: AuthenticatedRequest) {
  try {
    // Firebase Authentication kullanıcılarını listele
    const listUsersResult = await adminAuth.listUsers()
    const users = listUsersResult.users.map((user) => ({
      email: user.email,
      displayName: user.providerData[0]?.displayName,
      uid: user.uid,
    }))

    return NextResponse.json({
      success: true,
      patients: users,
    })
  } catch (error) {
    console.error("Get users error:", error)
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
  return withAuth("doctor")(request as AuthenticatedRequest, handler)
}
