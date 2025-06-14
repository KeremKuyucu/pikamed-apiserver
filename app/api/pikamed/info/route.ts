import { type NextRequest, NextResponse } from "next/server"
import { AuthCheck } from "../../lib/auth"
import { checkUser, sendFileToDiscord, sendMessageToDiscord } from "../../lib/discord-utils"
import { writeFile, unlink } from "fs/promises"
import path from "path"

export async function POST(request: NextRequest) {
  try {
    const authResult = await AuthCheck(request, "user")
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

    const {
      message,
      name,
      uid,
      photoURL,
      version,
      country,
      selectedLanguage,
      targetWater,
      availableWater,
      cupSize,
      changeWaterClock,
      changeWaterDay,
      InsulinListData,
      size,
      weight,
      changeWeightClock,
      bmiCategory,
      bmi,
      notificationRequest,
    } = await request.json()

    const userToken = authResult.user

    const logData = {
      name,
      uid,
      photoURL,
      selectedLanguage,
      targetWater,
      availableWater,
      cupSize,
      changeWaterClock,
      changeWaterDay,
      InsulinListData,
      size,
      weight,
      changeWeightClock,
      bmiCategory,
      bmi,
      notificationRequest,
    }

    const fileName = `log_${uid}.json`
    const filePath = path.join(process.cwd(), "tmp", fileName)
    const { channelId } = await checkUser(userToken.uid)

    const embed = {
      title: "📜 Yeni Log Mesajı",
      color: 3447003,
      fields: [
        {
          name: "👤 Kullanıcı",
          value: `**İsim:** ${name || "Bilinmiyor"}\n**UID:** \`${uid || "Bilinmiyor"}\``,
          inline: false,
        },
        { name: "🌍 Ülke", value: country || "Bilinmiyor", inline: true },
        { name: "📊 Sürümü", value: version || "Bilinmiyor", inline: true },
      ],
      thumbnail: {
        url: photoURL || "https://cdn.glitch.global/e74d89f5-045d-4ad2-94c7-e2c99ed95318/2815428.png?v=1738114346363",
      },
      timestamp: new Date(),
    }

    try {
      await writeFile(filePath, JSON.stringify(logData, null, 2))
      await sendFileToDiscord(filePath, channelId)
      await sendMessageToDiscord(null, "1352671968213864519", embed)
      await unlink(filePath)

      return NextResponse.json({
        success: true,
        message: "✅ Log mesajı başarıyla kaydedildi, gönderildi ve silindi!",
      })
    } catch (error) {
      console.error("❌ Hata oluştu:", error)

      try {
        await sendMessageToDiscord(null, "1352671968213864519", embed)
        return NextResponse.json({
          success: true,
          message: "✅ Log mesajı kaydedilemedi ancak mesaj gönderildi!",
        })
      } catch (innerError) {
        console.error("❌ Discord mesajı da gönderilemedi:", innerError)
        return NextResponse.json(
          {
            success: false,
            message: "❌ Log ve mesaj gönderilemedi.",
          },
          { status: 500 },
        )
      }
    }
  } catch (error) {
    console.error("Info error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
