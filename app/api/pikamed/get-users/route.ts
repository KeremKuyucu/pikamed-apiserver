import { type NextRequest, NextResponse } from "next/server"
import { AuthCheck } from "../../lib/auth"
import { getAuth } from "firebase-admin/auth"

export async function GET(request: NextRequest) {
  try {
    const authResult = await AuthCheck(request, "doctor")
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

    const listUsersResult = await getAuth().listUsers()
    const users = listUsersResult.users.map((user) => ({
      email: user.email,
      displayName: user.providerData[0]?.displayName,
      uid: user.uid,
    }))

    return NextResponse.json({
      success: true,
      patients: users,
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
