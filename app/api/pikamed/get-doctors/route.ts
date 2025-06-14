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
    const authResult = await AuthCheck(request, "admin")
    if (authResult.error) {
      const errorResponse = NextResponse.json({ error: authResult.error }, { status: authResult.status })
      return addCorsHeaders(errorResponse, request.headers.get("origin"))
    }

    const listUsersResult = await firebaseAuth.listUsers()
    const doctors = listUsersResult.users
      .filter((user) => user.customClaims?.role === "doctor")
      .map((user) => ({
        email: user.email,
        fullName: user.displayName,
        uid: user.uid,
      }))

    console.log(`✅ ${doctors.length} doktor listelendi`)

    const response = NextResponse.json({
      success: true,
      doctors,
    })
    return addCorsHeaders(response, request.headers.get("origin"))
  } catch (error: any) {
    console.error("❌ Doktor listesi hatası:", error)
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
