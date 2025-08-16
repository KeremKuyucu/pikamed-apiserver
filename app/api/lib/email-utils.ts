import Mailjet from "node-mailjet"

const mailjet = Mailjet.apiConnect(process.env.MAILJET_API_KEY || "", process.env.MAILJET_SECRET_KEY || "")

export async function sendEmail(to: string, subject: string, htmlContent: string) {
  try {
    const result = await mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: "pikamed@keremkk.com.tr",
            Name: "PikaMed",
          },
          To: [
            {
              Email: to,
            },
          ],
          Subject: subject,
          HTMLPart: htmlContent,
        },
      ],
    })

    console.log(`📨 E-posta gönderildi -> ${to}`)
    return result
  } catch (error: any) {
    console.error(`❌ E-posta gönderimi başarısız (${to}):`, error.message || error)
    throw error
  }
}

export function insulinAsiHatirlatma(email: string, name: string, appearanceTime: string, uid: string) {
  const unsubscribeLink = `${process.env.NEXT_PUBLIC_BASE_URL || "https://your-domain.vercel.app"}/api/pikamed/unsubscribe?uid=${uid}`

  const htmlContent = `
    <html>
      <body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f2f4f6; padding: 30px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); overflow: hidden;">
          <div style="background-color: #3498db; padding: 20px; text-align: center; color: #ffffff;">
            <h1 style="margin: 0; font-size: 24px;">İnsülin Aşı Hatırlatıcısı</h1>
          </div>
          <div style="padding: 30px;">
            <h2 style="color: #2c3e50;">Merhaba ${name},</h2>
            <p style="font-size: 16px; color: #555; line-height: 1.6; margin-top: 10px;">
              Bu bir nazik hatırlatmadır. İnsülin aşınızı 
              <strong style="color: #e74c3c;">${appearanceTime}</strong> tarihinde olmanız gerekmektedir.
            </p>
            <p style="font-size: 14px; color: #7f8c8d; margin-top: 20px;">
              Sağlıklı günler dileriz.<br/>
              <strong>Pikamed Ekibi</strong>
            </p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            <p style="font-size: 12px; color: #b0b0b0; text-align: center;">
              Bildirim almak istemiyorsanız, lütfen <a href="${unsubscribeLink}">buraya tıklayın</a> ve insülin aşı takviminizi kaldırın.
            </p>
          </div>
        </div>
        <div style="text-align: center; font-size: 11px; color: #aaa; margin-top: 20px;">
          © 2025 Pikamed. Tüm hakları saklıdır.
        </div>
      </body>
    </html>
  `

  return sendEmail(email, "İnsülin Aşı Zamanı Hatırlatması", htmlContent)
}
