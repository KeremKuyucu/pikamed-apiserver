import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { sebep, uid, name, profilUrl } = await request.json()

    const title = sebep === "Giriş" ? "🚪 Kullanıcı Giriş Yaptı" : "🚪 Kullanıcı Çıkış Yaptı"
    const color = sebep === "Giriş" ? 0x2ecc71 : 0xe74c3c

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

    // Discord webhook call would go here
    await sendMessageToDiscord(
      `📢 Kullanıcı ${sebep === "Giriş" ? "giriş yaptı" : "çıkış yaptı"}:`,
      "1329938136897421433",
      embed,
    )

    return NextResponse.json({
      success: true,
      message: `${sebep === "Giriş" ? "Giriş" : "Çıkış"} işlemi başarıyla kaydedildi.`,
    })
  } catch (error) {
    console.error("Auth log error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
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
