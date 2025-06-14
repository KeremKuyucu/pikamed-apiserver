import { type NextRequest, NextResponse } from "next/server"
import { AuthCheck } from "../../lib/auth"
import { getFileUrl, sendFileToDiscord } from "../../lib/discord-utils"
import { writeFile, readFile, unlink } from "fs/promises"
import path from "path"

export async function POST(request: NextRequest) {
  try {
    const authResult = await AuthCheck(request, "user")
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

    const { uid, name, email, InsulinListData, notificationRequest } = await request.json()

    const dataDirectory = path.join(process.cwd(), "tmp")
    const downloadPath = path.join(dataDirectory, "temp_notificationInfo.json")

    try {
      const fileUrl = await getFileUrl("1366022329708183632")
      const response = await fetch(fileUrl)
      const arrayBuffer = await response.arrayBuffer()

      let existingData: any = { users: [] }

      await writeFile(downloadPath, Buffer.from(arrayBuffer))

      try {
        const fileContent = await readFile(downloadPath, "utf-8")
        existingData = JSON.parse(fileContent)
      } catch {
        existingData = { users: [] }
      }

      const newUser = {
        uid,
        name,
        email,
        notificationRequest,
        InsulinListData: InsulinListData || [],
      }

      const userIndex = existingData.users.findIndex((user: any) => user.uid === uid)

      if (userIndex !== -1) {
        existingData.users[userIndex] = newUser
      } else {
        existingData.users.push(newUser)
      }

      await writeFile(downloadPath, JSON.stringify(existingData, null, 2))
      await sendFileToDiscord(downloadPath, "1366022329708183632")
      await unlink(downloadPath)

      return NextResponse.json({
        success: true,
        message: "Veri başarıyla kaydedildi ve güncellendi!",
      })
    } catch (error) {
      console.error("Hata:", error)
      return NextResponse.json(
        {
          success: false,
          message: "Veri kaydedilemedi veya dosya indirilemedi.",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("NotificationInfo error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
