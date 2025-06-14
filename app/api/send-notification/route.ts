import { type NextRequest, NextResponse } from "next/server"
import { withAuth, type AuthenticatedRequest } from "@/lib/auth-middleware"

async function handler(request: AuthenticatedRequest) {
  try {
    const body = await request.json()
    const { message, target, targetId, title } = body

    if (!message || !target || !title) {
      return NextResponse.json({ error: "Eksik alanlar mevcut" }, { status: 400 })
    }

    // Gerçek implementasyonda burada e-posta gönderme işlemi yapılır
    console.log("Notification to send:", { message, target, targetId, title })

    return NextResponse.json({
      success: true,
      message: "Bildirim başarıyla gönderildi!",
      sentCount: 1, // Mock değer
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Bildirim gönderimi sırasında bir hata oluştu.",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  return withAuth("admin")(request as AuthenticatedRequest, handler)
}
