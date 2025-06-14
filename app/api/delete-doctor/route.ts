import { type NextRequest, NextResponse } from "next/server"
import { withAuth, type AuthenticatedRequest } from "@/lib/auth-middleware"
import { adminAuth } from "@/lib/firebase-admin"

async function handler(request: AuthenticatedRequest) {
  try {
    const body = await request.json()
    const { doctorEmail } = body

    // Silinecek doktoru Firebase'den al
    const userRecord = await adminAuth.getUserByEmail(doctorEmail)

    // Kullanıcının özel rolünü null olarak ayarla
    await adminAuth.setCustomUserClaims(userRecord.uid, { role: null })

    return NextResponse.json({
      success: true,
      message: "Doktor başarıyla silindi!",
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: `Hata: ${error.message}`,
      },
      { status: 404 },
    )
  }
}

export async function POST(request: NextRequest) {
  return withAuth("admin")(request as AuthenticatedRequest, handler)
}
