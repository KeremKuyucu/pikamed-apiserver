import { type NextRequest, NextResponse } from "next/server"
import { AuthCheck } from "../../lib/auth"
import { getAuth } from "firebase-admin/auth"
import { sendEmail } from "../../lib/email-utils"

export async function POST(request: NextRequest) {
  try {
    const authResult = await AuthCheck(request, "admin")
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

    // `targetId` yerine `targetEmail` de destructure ediyoruz
    const { message, target, targetId, targetEmail, senderUid, title } = await request.json()

    // `targetEmail` hedef "external" olduğunda zorunlu olmalı
    if (!message || !target || !senderUid || !title || (target === "external" && !targetEmail)) {
      return NextResponse.json({ error: "Eksik alanlar mevcut veya hedef e-posta boş." }, { status: 400 })
    }

    console.log("📧 E-posta bildirimi başlatıldı:", { message, title, target, targetId, targetEmail })

    let recipients: any[] = []

    if (target === "all" || target === "doctors" || target === "patients") { // 'user' yerine 'patients' kullanıldı
      const allUsers: any[] = []
      let pageToken: string | undefined

      do {
        const result = await getAuth().listUsers(1000, pageToken)
        const usersWithEmail = result.users.filter((u) => u.email)
        allUsers.push(...usersWithEmail)
        pageToken = result.pageToken
      } while (pageToken)

      if (target === "all") {
        recipients = allUsers
      } else if (target === "doctors") {
        recipients = allUsers.filter((u) => u.customClaims?.role === "doctor")
      } else if (target === "patients") {
        // 'patients' rolüne sahip olmayan veya özel bir rolü olmayan tüm kullanıcılar
        recipients = allUsers.filter((u) => !u.customClaims?.role || (u.customClaims?.role !== "doctor" && u.customClaims?.role !== "admin"))
      }
    } else if (target === "specific") {
      if (!targetId) {
        return NextResponse.json({ error: "Belirli bir hasta hedefi için targetId gereklidir." }, { status: 400 });
      }
      const user = await getAuth().getUser(targetId)
      if (!user.email) {
        return NextResponse.json({ error: "Kullanıcının e-posta adresi bulunamadı." }, { status: 404 })
      }
      recipients = [user]
    } else if (target === "external") { // Yeni 'external' hedef tipi
      if (!targetEmail) {
        return NextResponse.json({ error: "Harici e-posta hedefi için targetEmail gereklidir." }, { status: 400 });
      }
      recipients = [{ email: targetEmail }] // Sadece e-posta adresi içeren bir obje oluşturuyoruz
    } else {
      return NextResponse.json({ error: "Geçersiz hedef tipi." }, { status: 400 })
    }

    const sendResults = await Promise.allSettled(recipients.map((r) => sendEmail(r.email, title, message)))

    const sentCount = sendResults.filter((r) => r.status === "fulfilled").length

    console.log(`✅ ${sentCount} kullanıcıya e-posta gönderildi.`)

    return NextResponse.json({ success: true, sentCount })
  } catch (err: any) {
    console.error("❌ E-posta gönderimi başarısız:", err)
    return NextResponse.json({ error: "E-posta gönderimi sırasında bir hata oluştu." }, { status: 500 })
  }
}