import { type NextRequest, NextResponse } from "next/server"
import { withAuth, type AuthenticatedRequest } from "@/lib/auth-middleware"
import { adminAuth } from "@/lib/firebase-admin"

async function handler(request: AuthenticatedRequest) {
  try {
    const body = await request.json()
    const { doctorEmail } = body

    // Doktorun e-posta adresini kullanarak kullanıcıyı al
    const userRecord = await adminAuth.getUserByEmail(doctorEmail)

    // Kullanıcıya "doctor" rolünü ata
    await adminAuth.setCustomUserClaims(userRecord.uid, { role: "doctor" })

    return NextResponse.json({
      success: true,
      message: "Doktor rolü başarıyla atandı!",
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
