import { type NextRequest, NextResponse } from "next/server"
import { initializeApp, getApps, cert } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"

// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
  initializeApp({
    credential: cert({
      type: "service_account",
      project_id: "marul-tarlasii",
      private_key_id: process.env.PIKAMED_FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.PIKAMED_FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      client_email: process.env.PIKAMED_FIREBASE_CLIENT_EMAIL,
      client_id: process.env.PIKAMED_FIREBASE_CLIENT_ID,
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: process.env.PIKAMED_FIREBASE_CLIENT_X509_CERT_URL,
      universe_domain: "googleapis.com",
    } as any),
  })
}

export async function POST(request: NextRequest) {
  try {
    // Auth check
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized: No token" }, { status: 401 })
    }

    const idToken = authHeader.split("Bearer ")[1]
    const decodedToken = await getAuth().verifyIdToken(idToken)

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

    if (uid !== decodedToken.uid) {
      return NextResponse.json({ error: "UID mismatch" }, { status: 403 })
    }

    const userRecord = await getAuth().getUser(uid)

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

    const data = await response.json()
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "Yanıt alınamadı."

    // Log to Discord
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

    // Send to Discord (implementation would go here)

    return NextResponse.json({ aiResponse })
  } catch (error) {
    console.error("AI API error:", error)
    return NextResponse.json({ error: "Gemini API hatası" }, { status: 500 })
  }
}
