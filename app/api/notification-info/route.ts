import { type NextRequest, NextResponse } from "next/server"
import { withAuth, type AuthenticatedRequest } from "@/lib/auth-middleware"

async function handler(request: AuthenticatedRequest) {
  try {
    const body = await request.json()
    const { uid, name, email, InsulinListData, notificationRequest } = body

    // Gerçek implementasyonda burada bildirim verilerini kaydetmek gerekir
    console.log("Notification info received:", {
      uid,
      name,
      email,
      InsulinListData,
      notificationRequest,
    })

    return NextResponse.json({
      success: true,
      message: "Bildirim bilgileri başarıyla kaydedildi!",
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Bildirim bilgileri kaydedilemedi.",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  return withAuth("user")(request as AuthenticatedRequest, handler)
}
