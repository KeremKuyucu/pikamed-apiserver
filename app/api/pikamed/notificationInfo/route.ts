import { type NextRequest, NextResponse } from "next/server"
import { AuthCheck } from "../../lib/auth"
import { getFileUrl, sendFileToDiscord } from "../../lib/discord-utils"
import { handleCors, addCorsHeaders } from "../../lib/cors"
import {
  getTempDir,
  safeWriteFile,
  safeReadFile,
  safeDeleteFile,
  createTempFileName,
  safeJsonParse,
} from "../../lib/file-utils"
import path from "path"

export async function OPTIONS(request: NextRequest) {
  return handleCors(request) || new NextResponse(null, { status: 200 })
}

export async function POST(request: NextRequest) {
  const corsResponse = handleCors(request)
  if (corsResponse) return corsResponse

  let tempFilePath: string | null = null
  let response: NextResponse | null = null

  try {
    const authResult = await AuthCheck(request, "user")
    if (authResult.error) {
      response = NextResponse.json({ error: authResult.error }, { status: authResult.status })
      return addCorsHeaders(response, request.headers.get("origin"))
    }

    const { uid, name, email, InsulinListData, notificationRequest } = await request.json()

    if (!uid || !name || !email) {
      response = NextResponse.json({ error: "Gerekli alanlar eksik" }, { status: 400 })
      return addCorsHeaders(response, request.headers.get("origin"))
    }

    // Geçici dosya yolu oluştur
    const tempDir = getTempDir()
    const fileName = createTempFileName("notificationInfo")
    tempFilePath = path.join(tempDir, fileName)

    console.log(`📁 Geçici dosya yolu: ${tempFilePath}`)

    // Discord'dan mevcut dosyayı indir
    console.log("📥 Discord'dan dosya indiriliyor...")
    const fileUrl = await getFileUrl("1366022329708183632")
    const fetchResponse = await fetch(fileUrl)

    if (!fetchResponse.ok) {
      throw new Error(`Discord dosya indirme hatası: ${fetchResponse.status}`)
    }

    const arrayBuffer = await fetchResponse.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Geçici dosyaya yaz
    await safeWriteFile(tempFilePath, buffer)

    // Dosyayı oku ve parse et
    let existingData: any = { users: [] }
    try {
      const fileContent = await safeReadFile(tempFilePath)
      existingData = safeJsonParse(fileContent, { users: [] })
    } catch (parseError) {
      console.warn("⚠️ Mevcut dosya parse edilemedi, yeni dosya oluşturuluyor")
      existingData = { users: [] }
    }

    // Kullanıcı verisini hazırla
    const newUser = {
      uid,
      name,
      email,
      notificationRequest: notificationRequest || false,
      InsulinListData: InsulinListData || [],
      updatedAt: new Date().toISOString(),
    }

    // Mevcut kullanıcıyı bul veya ekle
    const userIndex = existingData.users.findIndex((user: any) => user.uid === uid)

    if (userIndex !== -1) {
      existingData.users[userIndex] = newUser
      console.log(`🔄 Kullanıcı güncellendi: ${uid}`)
    } else {
      existingData.users.push(newUser)
      console.log(`➕ Yeni kullanıcı eklendi: ${uid}`)
    }

    // Güncellenmiş veriyi dosyaya yaz
    const updatedContent = JSON.stringify(existingData, null, 2)
    await safeWriteFile(tempFilePath, updatedContent)

    // Discord'a geri yükle
    console.log("📤 Discord'a dosya yükleniyor...")
    await sendFileToDiscord(tempFilePath, "1366022329708183632")

    // Başarılı yanıt
    response = NextResponse.json({
      success: true,
      message: "Bildirim tercihleri başarıyla güncellendi!",
      userCount: existingData.users.length,
    })

    return addCorsHeaders(response, request.headers.get("origin"))
  } catch (fileError: any) {
    console.error("❌ Dosya işlemi hatası:", fileError)

    // Fallback: Sadece yeni veriyi kaydet
    const { uid, name, email, InsulinListData, notificationRequest } = await request.json()
    const fallbackData = {
      users: [
        {
          uid,
          name,
          email,
          notificationRequest: notificationRequest || false,
          InsulinListData: InsulinListData || [],
          updatedAt: new Date().toISOString(),
          note: "Fallback mode - mevcut veriler birleştirilemedi",
        },
      ],
    }

    const fallbackPath = path.join(getTempDir(), createTempFileName("fallback_notification"))
    await safeWriteFile(fallbackPath, JSON.stringify(fallbackData, null, 2))

    try {
      await sendFileToDiscord(fallbackPath, "1366022329708183632")
      await safeDeleteFile(fallbackPath)

      response = NextResponse.json({
        success: true,
        message: "Veri fallback modunda kaydedildi (mevcut verilerle birleştirilemedi)",
        fallback: true,
      })
      return addCorsHeaders(response, request.headers.get("origin"))
    } catch (fallbackError) {
      console.error("❌ Fallback da başarısız:", fallbackError)
      throw fileError
    }
  } finally {
    // Cleanup: Geçici dosyayı sil
    if (tempFilePath) {
      await safeDeleteFile(tempFilePath)
    }
  }
}
