import { type NextRequest, NextResponse } from "next/server"
import { withAuth, type AuthenticatedRequest } from "@/lib/auth-middleware"
import { adminAuth } from "@/lib/firebase-admin"
import { sendEmail } from "@/lib/mailjet"
import { sendMessageToDiscord } from "@/lib/discord"

async function handler(request: AuthenticatedRequest) {
  try {
    const { doktorUid, patientUid } = await request.json()

    // Firebase Admin SDK ile UID'ye göre rol doğrulama
    const doctor = await adminAuth.getUser(doktorUid)
    const patient = await adminAuth.getUser(patientUid)

    if (doctor.customClaims?.role !== "doctor") {
      return NextResponse.json(
        {
          success: false,
          error: "Yetkisiz erişim!",
        },
        { status: 401 },
      )
    }

    const doktoradi = doctor.providerData[0]?.displayName || "Bilinmeyen Doktor"
    const hastaadi = patient.providerData[0]?.displayName || "Bilinmeyen Hasta"
    const tarihSaat = new Date().toLocaleString("tr-TR")

    const htmlContent = `<!DOCTYPE html>
    <html lang="tr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Önemli Uyarı: Hasta Bilgilerine Erişim Sağlandı</title>
        <style>
            body { font-family: Arial, sans-serif; background-color: #121212; color: #ddd; }
            .container { max-width: 600px; margin: 20px auto; background-color: #1e1e2e; padding: 20px; border-radius: 10px; }
            .header { text-align: center; padding: 20px; }
            h1 { font-size: 22px; color: #f8f8f2; }
            p { font-size: 16px; line-height: 1.5; }
            .details { background-color: #282a36; padding: 10px; border-radius: 5px; }
            .details strong { color: #ff79c6; }
            .footer { margin-top: 20px; text-align: center; font-size: 14px; color: #888; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Konu: Önemli Uyarı: Hasta Bilgilerine Erişim Sağlandı</h1>
            <p>Merhaba,</p>
            <p>Bu e-posta, <strong>${doktoradi}</strong> tarafından <strong>${hastaadi}</strong> adlı hastanın bilgilerine erişildiğini bildirmek amacıyla gönderilmiştir.</p>
            <div class="details">
                <p><strong>Doktor:</strong> ${doktoradi}</p>
                <p><strong>Hasta:</strong> ${hastaadi}</p>
                <p><strong>Tarih ve Saat:</strong> ${tarihSaat}</p>
            </div>
            <p>Eğer haberiniz yoksa veya yetkisiz bir erişim olduğunu düşünüyorsanız, lütfen hemen bizimle iletişime geçin.</p>
            <div class="footer">
                <p>Sağlıklı günler dileriz,<br>PikaMed Destek Ekibi</p>
            </div>
        </div>
    </body>
    </html>`

    // Send email
    await sendEmail({
      to: patient.email!,
      toName: hastaadi,
      subject: "Güvenlik Uyarısı",
      htmlContent,
    })

    // Discord'a log gönder
    const discordEmbed = {
      title: "Hasta Bilgilerine Erişim Uyarısı",
      color: 16711680,
      fields: [
        {
          name: "Doktor Bilgileri",
          value: `**İsim:** ${doktoradi}\n**UID:** \`${doktorUid}\``,
          inline: false,
        },
        {
          name: "Hasta Bilgileri",
          value: `**İsim:** ${hastaadi}\n**UID:** \`${patientUid}\``,
          inline: false,
        },
      ],
      timestamp: new Date(),
    }

    await sendMessageToDiscord("", process.env.pikamed_bakilanhastalog!, discordEmbed)

    return NextResponse.json({
      success: true,
      message: "E-posta ve Discord log başarıyla gönderildi!",
    })
  } catch (error: any) {
    console.error("Send warning error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  return withAuth("doctor")(request as AuthenticatedRequest, handler)
}
