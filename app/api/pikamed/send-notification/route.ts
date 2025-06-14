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

    const { message, target, targetId, senderUid, title } = await request.json()

    if (!message || !target || !senderUid || !title) {
      return NextResponse.json({ error: "Eksik alanlar mevcut" }, { status: 400 })
    }

    console.log("📧 E-posta bildirimi başlatıldı:", { message, title, target, targetId })

    let recipients: any[] = []

    if (target === "all" || target === "doctor" || target === "user") {
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
      } else {
        recipients = allUsers.filter((u) => u.customClaims?.role === target)
      }
    } else if (target === "specific") {
      const user = await getAuth().getUser(targetId)
      if (!user.email) {
        return NextResponse.json({ error: "Kullanıcının e-posta adresi bulunamadı." }, { status: 404 })
      }
      recipients = [user]
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
