import { type NextRequest, NextResponse } from "next/server"
import { AuthCheck } from "../../lib/auth"
import { checkUser, sendFileToDiscord, sendMessageToDiscord } from "../../lib/discord-utils"
import { handleCors, addCorsHeaders } from "../../lib/cors"
import { getTempDir, safeWriteFile, safeDeleteFile, createTempFileName } from "../../lib/file-utils"
import path from "path"

export async function OPTIONS(request: NextRequest) {
  return handleCors(request) || new NextResponse(null, { status: 200 })
}

export async function POST(request: NextRequest) {
  const corsResponse = handleCors(request)
  if (corsResponse) return corsResponse

  let tempFilePath: string | null = null

  try {
    const authResult = await AuthCheck(request, "user")
    if (authResult.error) {
      const errorResponse = NextResponse.json({ error: authResult.error }, { status: authResult.status })
      return addCorsHeaders(errorResponse, request.headers.get("origin"))
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
      timestamp: new Date().toISOString(),
      version,
      country,
      message,
    }

    // Geçici dosya oluştur
    const tempDir = getTempDir()
    const fileName = createTempFileName(`log_${uid}`)
    tempFilePath = path.join(tempDir, fileName)

    console.log(`📁 Log dosyası oluşturuluyor: ${tempFilePath}`)

    // Kullanıcı kanalını kontrol et
    const userCheck = await checkUser(userToken.uid)
    if (!userCheck.success) {
      throw new Error("Kullanıcı kanalı oluşturulamadı")
    }

    const { channelId } = userCheck

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
        { name: "📊 Sürüm", value: version || "Bilinmiyor", inline: true },
      ],
      thumbnail: {
        url: photoURL || "https://raw.githubusercontent.com/KeremKuyucu/PikaMed/main/assets/custom_profile.png",
      },
      timestamp: new Date(),
    }

    try {
      // Log dosyasını oluştur
      await safeWriteFile(tempFilePath, JSON.stringify(logData, null, 2))

      // Discord'a gönder
      await sendFileToDiscord(tempFilePath, channelId)
      await sendMessageToDiscord(null, "1352671968213864519", embed)

      console.log("✅ Log başarıyla kaydedildi ve gönderildi")

      const response = NextResponse.json({
        success: true,
        message: "Log mesajı başarıyla kaydedildi ve gönderildi!",
      })
      return addCorsHeaders(response, request.headers.get("origin"))
    } catch (fileError: any) {
      console.error("❌ Dosya gönderimi başarısız, sadece embed gönderiliyor:", fileError)

      // Fallback: Sadece embed gönder
      try {
        await sendMessageToDiscord(
          `📋 **Log Verisi (Dosya Gönderilemedi)**\n\`\`\`json\n${JSON.stringify(logData, null, 2).substring(0, 1500)}\n\`\`\``,
          "1352671968213864519",
          embed,
        )

        const response = NextResponse.json({
          success: true,
          message: "Log mesajı gönderildi (dosya yüklenemedi)",
          fallback: true,
        })
        return addCorsHeaders(response, request.headers.get("origin"))
      } catch (embedError) {
        console.error("❌ Embed gönderimi de başarısız:", embedError)
        throw fileError
      }
    }
  } catch (error: any) {
    console.error("❌ Info API hatası:", error)
    const errorResponse = NextResponse.json(
      {
        success: false,
        message: "Log kaydedilemedi",
        error: error.message,
      },
      { status: 500 },
    )
    return addCorsHeaders(errorResponse, request.headers.get("origin"))
  } finally {
    // Cleanup: Geçici dosyayı sil
    if (tempFilePath) {
      await safeDeleteFile(tempFilePath)
    }
  }
}
