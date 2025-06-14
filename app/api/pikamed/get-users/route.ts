import { type NextRequest, NextResponse } from "next/server"
import { AuthCheck } from "../../lib/auth"
import { firebaseAuth } from "../../lib/firebase-admin"
import { handleCors, addCorsHeaders } from "../../lib/cors"

export async function OPTIONS(request: NextRequest) {
  return handleCors(request) || new NextResponse(null, { status: 200 })
}

export async function GET(request: NextRequest) {
  const corsResponse = handleCors(request)
  if (corsResponse) return corsResponse

  try {
    const authResult = await AuthCheck(request, "doctor")
    if (authResult.error) {
      const errorResponse = NextResponse.json({ error: authResult.error }, { status: authResult.status })
      return addCorsHeaders(errorResponse, request.headers.get("origin"))
    }

    const listUsersResult = await firebaseAuth.listUsers()
    const users = listUsersResult.users.map((user) => ({
      email: user.email,
      displayName: user.providerData[0]?.displayName,
      uid: user.uid,
    }))

    const response = NextResponse.json({
      success: true,
      patients: users,
    })
    return addCorsHeaders(response, request.headers.get("origin"))
  } catch (error: any) {
    console.error("❌ Kullanıcı listesi hatası:", error)
    const errorResponse = NextResponse.json(
      {
        success: false,
        message: `Hata: ${error.message}`,
      },
      { status: 500 },
    )
    return addCorsHeaders(errorResponse, request.headers.get("origin"))
  }
}
