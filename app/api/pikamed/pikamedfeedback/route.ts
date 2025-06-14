import { type NextRequest, NextResponse } from "next/server"
import { AuthCheck } from "../../lib/auth"

export async function POST(request: NextRequest) {
  try {
    const authResult = await AuthCheck(request, "user")
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

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

    await sendMessageToDiscord("", "1330317334954643477", embed)
    return NextResponse.json({ success: true, message: "Mesaj başarıyla gönderildi!" })
  } catch (error) {
    console.error("Feedback error:", error)
    return NextResponse.json({ error: "Mesaj gönderilirken bir hata oluştu." }, { status: 500 })
  }
}

async function sendMessageToDiscord(message: string, channelId: string, embed: any) {
  if (!process.env.BOT_TOKEN) return

  try {
    const response = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bot ${process.env.BOT_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: message,
        embeds: embed ? [embed] : [],
      }),
    })

    if (!response.ok) {
      console.error("Discord API error:", await response.text())
    }
  } catch (error) {
    console.error("Failed to send Discord message:", error)
  }
}
