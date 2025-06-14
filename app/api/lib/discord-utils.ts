import { writeFile, readFile } from "fs/promises"
import { getAuth } from "firebase-admin/auth"
import path from "path"

export async function sendMessageToDiscord(message: string | null, channelId: string, embed: any) {
  if (!process.env.BOT_TOKEN) return

  try {
    const response = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bot ${process.env.BOT_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: message,
        embeds: embed ? [embed] : [],
      }),
    })

    if (!response.ok) {
      console.error("Discord API error:", await response.text())
    }
  } catch (error) {
    console.error("Failed to send Discord message:", error)
  }
}

export async function sendFileToDiscord(filePath: string, channelId: string) {
  if (!process.env.BOT_TOKEN) return

  try {
    const fileBuffer = await readFile(filePath)
    const formData = new FormData()

    const blob = new Blob([fileBuffer], { type: "application/json" })
    formData.append("file", blob, path.basename(filePath))

    const response = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bot ${process.env.BOT_TOKEN}`,
      },
      body: formData,
    })

    if (!response.ok) {
      console.error("Discord file upload error:", await response.text())
    } else {
      console.log("Dosya başarıyla gönderildi!")
    }
  } catch (error) {
    console.error("Failed to send file to Discord:", error)
  }
}

export async function getFileUrl(channelId: string): Promise<string> {
  if (!process.env.BOT_TOKEN) throw new Error("Bot token not found")

  try {
    const response = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages?limit=1`, {
      headers: {
        Authorization: `Bot ${process.env.BOT_TOKEN}`,
      },
    })

    const messages = await response.json()

    if (messages && messages.length > 0) {
      const lastMessage = messages[0]
      if (lastMessage.attachments && lastMessage.attachments.length > 0) {
        return lastMessage.attachments[0].url
      } else {
        throw new Error("Mesajda dosya yok.")
      }
    } else {
      throw new Error("Mesaj bulunamadı.")
    }
  } catch (error: any) {
    console.error("Mesaj alınırken hata oluştu:", error.message)
    throw error
  }
}

export async function createChannelpikamed(channelName: string): Promise<string> {
  if (!process.env.BOT_TOKEN) throw new Error("Bot token not found")

  const url = `https://discord.com/api/v10/guilds/1191345125834641418/channels`

  const body = {
    name: channelName,
    type: 0,
    parent_id: "1349822688465649736",
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bot ${process.env.BOT_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const error = await response.json()
    console.error("❌ Kanal oluşturulamadı:", error)
    throw new Error("Kanal oluşturulamadı")
  }

  const data = await response.json()
  console.log(`✅ Kanal oluşturuldu: ${data.name} (ID: ${data.id})`)
  return data.id
}

export async function checkUser(uid: string) {
  if (!uid) {
    throw new Error("❌ UID gereklidir.")
  }

  try {
    const userRecord = await getAuth().getUser(uid)
    const userName = userRecord.providerData[0]?.displayName || `User_${uid.substring(0, 5)}`

    const DATABASE_PATH = path.join(process.cwd(), "tmp", "pikamed.json")

    try {
      const fileUrl = await getFileUrl("1349826932556038327")
      const response = await fetch(fileUrl)
      const arrayBuffer = await response.arrayBuffer()
      await writeFile(DATABASE_PATH, Buffer.from(arrayBuffer))
      console.log("Dosya başarıyla indirildi:", DATABASE_PATH)
    } catch (error) {
      throw new Error("❌ Dosya indirilemedi.")
    }

    let dbContent: string
    try {
      dbContent = await readFile(DATABASE_PATH, "utf8")
    } catch {
      dbContent = '{"users": {}}'
    }

    const db = JSON.parse(dbContent)

    if (!db.users) {
      db.users = {}
    }

    if (db.users[uid]) {
      return {
        success: true,
        isNew: false,
        uid,
        channelId: db.users[uid].channelID,
      }
    } else {
      const newChannelID = await createChannelpikamed(userName)
      db.users[uid] = { channelID: newChannelID }

      console.log(`🆕 Yeni kullanıcı eklendi: UID=${uid}, KanalID=${newChannelID}, Kullanıcı Adı=${userName}`)

      await writeFile(DATABASE_PATH, JSON.stringify(db, null, 2))
      await sendFileToDiscord(DATABASE_PATH, "1349826932556038327")

      return {
        success: true,
        isNew: true,
        uid,
        channelId: newChannelID,
      }
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "❌ Bilinmeyen bir hata oluştu.",
    }
  }
}
