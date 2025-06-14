import { type NextRequest, NextResponse } from "next/server"
import { AuthCheck } from "../../lib/auth"
import { firebaseAuth } from "../../lib/firebase-admin"
import { handleCors, addCorsHeaders } from "../../lib/cors"

export async function OPTIONS(request: NextRequest) {
  return handleCors(request) || new NextResponse(null, { status: 200 })
}

export async function POST(request: NextRequest) {
  const corsResponse = handleCors(request)
  if (corsResponse) return corsResponse

  try {
    const authResult = await AuthCheck(request, "admin")
    if (authResult.error) {
      const errorResponse = NextResponse.json({ error: authResult.error }, { status: authResult.status })
      return addCorsHeaders(errorResponse, request.headers.get("origin"))
    }

    const { uid, doctorEmail } = await request.json()

    if (!doctorEmail) {
      const errorResponse = NextResponse.json({ error: "Doctor email is required" }, { status: 400 })
      return addCorsHeaders(errorResponse, request.headers.get("origin"))
    }

    try {
      const userRecord = await firebaseAuth.getUserByEmail(doctorEmail)
      await firebaseAuth.setCustomUserClaims(userRecord.uid, { role: null })

      console.log(`✅ Doktor rolü kaldırıldı: ${doctorEmail} (${userRecord.uid})`)

      const response = NextResponse.json({
        success: true,
        message: "Doktor başarıyla silindi!",
      })
      return addCorsHeaders(response, request.headers.get("origin"))
    } catch (error: any) {
      console.error("❌ Doktor silme hatası:", error)
      const errorResponse = NextResponse.json(
        {
          success: false,
          message: `Hata: ${error.message}`,
        },
        { status: 404 },
      )
      return addCorsHeaders(errorResponse, request.headers.get("origin"))
    }
  } catch (error) {
    console.error("Delete doctor error:", error)
    const errorResponse = NextResponse.json({ error: "Internal server error" }, { status: 500 })
    return addCorsHeaders(errorResponse, request.headers.get("origin"))
  }
}
