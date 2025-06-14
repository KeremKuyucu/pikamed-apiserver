import { type NextRequest, NextResponse } from "next/server"
import { AuthCheck } from "../../lib/auth"
import { firebaseAuth } from "../../lib/firebase-admin"

export async function POST(request: NextRequest) {
  try {
    // Auth check
    const authResult = await AuthCheck(request, "user")
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

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
    } = await request.json()

    if (uid !== authResult.user.uid) {
      return NextResponse.json({ error: "UID mismatch" }, { status: 403 })
    }

    const userRecord = await firebaseAuth.getUser(uid)

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

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 })
    }

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
      const errorText = await response.text()
      console.error("Gemini API error:", errorText)
      return NextResponse.json({ error: "Gemini API hatası" }, { status: 500 })
    }

    const data = await response.json()
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "Yanıt alınamadı."

    // Log to Discord (optional, can be removed if not needed)
    const embed = {
      title: "Gemini API Log",
      color: 3447003,
      fields: [
        {
          name: "👤 Kullanıcı",
          value: `**İsim:** \`${userRecord.displayName || "Bilinmiyor"}\`\n**UID:** \`${uid || "Bilinmiyor"}\`\n**E-Posta:** \`${userRecord.email || "Bilinmiyor"}\``,
        },
      ],
      thumbnail: { url: userRecord.photoURL },
      timestamp: new Date(),
    }

    // Send to Discord (implementation would go here if needed)

    return NextResponse.json({ aiResponse })
  } catch (error: any) {
    console.error("AI API error:", error)
    return NextResponse.json({ error: "Gemini API hatası: " + error.message }, { status: 500 })
  }
}
