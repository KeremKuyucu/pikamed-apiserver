import { type NextRequest, NextResponse } from "next/server"
import { withAuth, type AuthenticatedRequest } from "@/lib/auth-middleware"
import { sendMessageToDiscord, sendFileToDiscord } from "@/lib/discord"
import { writeFile, unlink } from "fs/promises"
import { join } from "path"

async function handler(request: AuthenticatedRequest) {
  try {
    const body = await request.json()
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
    } = body

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

    // Create log file
    const fileName = `log_${uid}.json`
    const filePath = join("/tmp", fileName)

    await writeFile(filePath, JSON.stringify(logData, null, 2))

    // Send file to Discord
    await sendFileToDiscord(filePath, process.env.pikamed_info!)

    // Send embed to info channel
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

    await sendMessageToDiscord(null, process.env.pikamed_info!, embed)

    // Clean up
    await unlink(filePath)

    return NextResponse.json({
      success: true,
      message: "✅ Log mesajı başarıyla kaydedildi, gönderildi ve silindi!",
    })
  } catch (error) {
    console.error("❌ Info endpoint hatası:", error)
    return NextResponse.json(
      {
        success: false,
        message: "❌ Log kaydedilemedi.",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  return withAuth("user")(request as AuthenticatedRequest, handler)
}
