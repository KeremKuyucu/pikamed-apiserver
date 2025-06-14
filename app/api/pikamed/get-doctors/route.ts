import { type NextRequest, NextResponse } from "next/server"
import { AuthCheck } from "../../lib/auth"
import { getAuth } from "firebase-admin/auth"

export async function GET(request: NextRequest) {
  try {
    const authResult = await AuthCheck(request, "admin")
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

    const listUsersResult = await getAuth().listUsers()
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
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: `Hata: ${error.message}`,
      },
      { status: 500 },
    )
  }
}
