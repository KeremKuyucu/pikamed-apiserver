import { type NextRequest, NextResponse } from "next/server"
import { AuthCheck } from "../../lib/auth"
import { checkUser } from "../../lib/discord-utils"

export async function POST(request: NextRequest) {
  try {
    const authResult = await AuthCheck(request, "user")
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

    const { uid } = await request.json()
    const userToken = authResult.user

    if (uid !== userToken.uid) {
      const roleToLevel = {
        user: 0,
        doctor: 1,
        admin: 3,
        superadmin: 5,
      }
      const userRoleLevel = roleToLevel[userToken.role as keyof typeof roleToLevel] || 0

      if (userRoleLevel < roleToLevel["doctor"]) {
        return NextResponse.json({ error: "Bu kullanıcıya ait verilere erişim yetkiniz yok." }, { status: 403 })
      }
    }

    const { channelId } = await checkUser(uid)

    const channelResponse = await fetch(`https://discord.com/api/v10/channels/${channelId}`, {
      headers: { Authorization: `Bot ${process.env.BOT_TOKEN}` },
    })
    const channelData = await channelResponse.json()

    if (!channelData.parent_id || channelData.parent_id !== "1349822688465649736") {
      return NextResponse.json({ hata: "Bu kanalın bulunduğu kategoride işlem yapılamaz." }, { status: 403 })
    }

    const messagesResponse = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages?limit=1`, {
      headers: { Authorization: `Bot ${process.env.BOT_TOKEN}` },
    })

    const messages = await messagesResponse.json()

    if (messages.length > 0) {
      const lastMessage = messages[0]

      if (lastMessage.attachments && lastMessage.attachments.length > 0) {
        const fileUrl = lastMessage.attachments[0].url
        const fileResponse = await fetch(fileUrl)

        if (!fileResponse.ok) {
          return NextResponse.json({ hata: "Dosya indirilemedi." }, { status: 404 })
        }

        const fileBuffer = await fileResponse.arrayBuffer()

        return new NextResponse(fileBuffer, {
          headers: {
            "Content-Type": fileResponse.headers.get("content-type") || "application/octet-stream",
          },
        })
      } else {
        return NextResponse.json({ hata: "Mesajda dosya bulunamadı." }, { status: 404 })
      }
    } else {
      return NextResponse.json({ hata: "Kanalda hiç mesaj yok." }, { status: 404 })
    }
  } catch (error: any) {
    console.error("Userdata error:", error)
    return NextResponse.json({ hata: "Sunucu hatası: " + error.message }, { status: 500 })
  }
}
