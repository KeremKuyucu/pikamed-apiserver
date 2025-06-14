import { type NextRequest, NextResponse } from "next/server"
import { withAuth, type AuthenticatedRequest } from "@/lib/auth-middleware"
import { sendMessageToDiscord } from "@/lib/discord"

async function handler(request: AuthenticatedRequest) {
  try {
    const { sebep, message, isim, eposta, uid } = await request.json()

    const embed = {
      title: "Yeni İletişim Formu Gönderildi",
      color: 0x3498db,
      fields: [
        {
          name: "Nedeni",
          value: sebep || "Verilmedi",
          inline: true,
        },
        {
          name: "Mesaj",
          value: message,
          inline: false,
        },
        {
          name: "Kullanıcı Bilgileri",
          value: `İsim: ${isim}\nE-posta: ${eposta}\nUID: ${uid}`,
          inline: false,
        },
      ],
      footer: {
        text: "Yeni iletişim formu alındı",
      },
      timestamp: new Date(),
    }

    await sendMessageToDiscord("", process.env.pikamed_feedback!, embed)

    return NextResponse.json({
      success: true,
      message: "Mesaj başarıyla gönderildi!",
    })
  } catch (error) {
    console.error("Feedback error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Mesaj gönderilirken bir hata oluştu.",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  return withAuth("user")(request as AuthenticatedRequest, handler)
}
