import { type NextRequest, NextResponse } from "next/server"
import { withAuth, type AuthenticatedRequest } from "@/lib/auth-middleware"
import { sendMessageToDiscord } from "@/lib/discord"
import { adminAuth } from "@/lib/firebase-admin"
import { writeFile, unlink } from "fs/promises"
import { join } from "path"

async function handler(request: AuthenticatedRequest) {
  try {
    const body = await request.json()
    const {
      uid,
      message,
      targetWater,
      availableWater,
      cupSize,
      changeWaterDay,
      changeWaterClock,
      weight,
      size,
      bmi,
      bmiCategory,
      name,
      selectedLanguage,
      localTime,
      insulinPlan,
    } = body

    // Verify user with Firebase
    const userRecord = await adminAuth.getUser(uid)
    console.log("Kullanıcı doğrulandı:", userRecord.toJSON())

    const prompt = `
    Sen bir endokrinoloji uzmanı (doktor) rolündesin. Sana mesaj atan kişiler, tip 1 diyabet hastası olan bireylerdir.
    Onlarla yalnızca bir doktor gibi profesyonel bir dille, nazik ve kısa şekilde iletişim kur.

    Cevap Kuralları:
    - Sadece kullanıcının mesajındaki soruya odaklan ve onun dışına çıkma.
    - Gereksiz bilgi, tavsiye veya sohbet ekleme.
    - Yanıtlarda kısa, net ve hastayı rahatlatıcı bir üslup kullan.
    - İnsülin dozunu değerlendirirken hastanın kilosunu ve günlük su tüketimini dikkate al.
    - Sorulmadıkça farklı bir bilgi veya açıklama yapma.

    Hasta Bilgileri:
    - Günlük Su Tüketim Hedefi: ${targetWater} ml
    - Şu ana kadar İçilen Su: ${availableWater} ml
    - Bardak Boyutu: ${cupSize} ml
    - Su Takibi Yenilenme Günü/Saati: ${changeWaterDay}, ${changeWaterClock}
    - Kilo: ${weight} kg
    - Boy: ${size} cm
    - Vücut Kitle İndeksi (BMI): ${bmi} (${bmiCategory})
    - Adı: ${name}
    - Konuşma Dili: ${selectedLanguage}
    - Yerel Saat: ${localTime}

    İnsülin Kullanım Planı:
    ${JSON.stringify(insulinPlan, null, 2)}

    Kullanıcının Mesajı:
    <<${message}>>
    `

    // Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      },
    )

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`)
    }

    const geminiData = await response.json()
    const aiResponse = geminiData.candidates?.[0]?.content?.parts?.[0]?.text ?? "Yanıt alınamadı."

    // Create log file
    const timestamp = new Date().toISOString().replace(/[:.-]/g, "_")
    const logFileName = `gemini-log-${uid}-${timestamp}.txt`
    const logFilePath = join("/tmp", logFileName)

    const logText = `📥 Prompt:\n${prompt}\n\n🤖 AI Yanıtı:\n${aiResponse}`
    await writeFile(logFilePath, logText)

    // Send to Discord
    const embed = {
      title: "Gemini API Log",
      color: 3447003,
      fields: [
        {
          name: "👤 Kullanıcı",
          value: `**İsim:** \`${userRecord.displayName || "Bilinmiyor"}\`\n**UID:** \`${uid || "Bilinmiyor"}\`\n**E-Posta:** \`${userRecord.email || "Bilinmiyor"}\``,
        },
      ],
      thumbnail: { url: userRecord.photoURL || "" },
      timestamp: new Date(),
    }

    await sendMessageToDiscord("Gemini yanıtı ve prompt ektedir.", process.env.pikamed_ailog!, embed, logFilePath)

    // Clean up log file
    await unlink(logFilePath)

    return NextResponse.json({ aiResponse })
  } catch (error: any) {
    if (error.code === "auth/user-not-found") {
      return NextResponse.json({ error: "Geçersiz kullanıcı ID'si" }, { status: 403 })
    }
    console.error("AI API error:", error)
    return NextResponse.json({ error: "Gemini API hatası" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  return withAuth("user")(request as AuthenticatedRequest, handler)
}
