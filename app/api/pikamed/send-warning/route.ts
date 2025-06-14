import { type NextRequest, NextResponse } from "next/server"
import { AuthCheck } from "../../lib/auth"
import { getAuth } from "firebase-admin/auth"
import { sendEmail } from "../../lib/email-utils"
import { sendMessageToDiscord } from "../../lib/discord-utils"

export async function POST(request: NextRequest) {
  try {
    const authResult = await AuthCheck(request, "doctor")
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

    const { doktorUid, patientUid } = await request.json()

    const doctor = await getAuth().getUser(doktorUid)
    const patient = await getAuth().getUser(patientUid)

    if (doctor.customClaims?.role !== "doctor") {
      return NextResponse.json({ success: false, error: "Yetkisiz erişim!" }, { status: 401 })
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

    await sendEmail(patient.email!, "Güvenlik Uyarısı", htmlContent)

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

    await sendMessageToDiscord("", "1353315831127212124", discordEmbed)

    return NextResponse.json({
      success: true,
      message: "E-posta ve Discord log başarıyla gönderildi!",
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
