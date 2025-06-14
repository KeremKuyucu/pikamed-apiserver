import { type NextRequest, NextResponse } from "next/server"
import { sendMessageToDiscord } from "@/lib/discord"

export async function POST(request: NextRequest) {
  try {
    const { sebep, uid, name, profilUrl } = await request.json()

    // Mesaj başlığı ve rengi belirle
    const title = sebep === "Giriş" ? "🚪 Kullanıcı Giriş Yaptı" : "🚪 Kullanıcı Çıkış Yaptı"
    const color = sebep === "Giriş" ? 0x2ecc71 : 0xe74c3c

    // Embed Mesajı Tanımla
    const embed = {
      title: title,
      color: color,
      fields: [
        { name: "👤 İsim", value: name, inline: true },
        { name: "🆔 UID", value: `\`${uid}\``, inline: false },
        { name: "Sebep", value: sebep, inline: false },
      ],
      thumbnail: {
        url: profilUrl,
      },
      footer: {
        text: "PikaMed Giriş/Çıkış Logu",
        icon_url: "https://cdn.glitch.global/e74d89f5-045d-4ad2-94c7-e2c99ed95318/logo.jpg?v=1737331226085",
      },
      timestamp: new Date(),
    }

    await sendMessageToDiscord(
      `📢 Kullanıcı ${sebep === "Giriş" ? "giriş yaptı" : "çıkış yaptı"}:`,
      process.env.pikamed_authlog!,
      embed,
    )

    return NextResponse.json({
      success: true,
      message: `${sebep === "Giriş" ? "Giriş" : "Çıkış"} işlemi başarıyla kaydedildi.`,
    })
  } catch (error) {
    console.error("Auth log error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Log kaydedilemedi",
      },
      { status: 500 },
    )
  }
}
