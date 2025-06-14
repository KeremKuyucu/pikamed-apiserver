interface DiscordEmbed {
  title?: string
  description?: string
  color?: number
  fields?: Array<{
    name: string
    value: string
    inline?: boolean
  }>
  thumbnail?: {
    url: string
  }
  footer?: {
    text: string
    icon_url?: string
  }
  timestamp?: Date
}

export async function sendMessageToDiscord(
  message: string | null,
  channelId: string,
  embed?: DiscordEmbed,
  filePath?: string,
) {
  if (!channelId || typeof channelId !== "string" || channelId.trim() === "") {
    console.error("Geçersiz kanal kimliği.")
    throw new Error("Geçersiz kanal kimliği.")
  }

  try {
    const url = `https://discord.com/api/v10/channels/${channelId}/messages`

    if (filePath) {
      // File upload with FormData
      const FormData = require("form-data")
      const fs = require("fs")

      const form = new FormData()
      form.append(
        "payload_json",
        JSON.stringify({
          content: message,
          embeds: embed ? [embed] : [],
        }),
      )
      form.append("file", fs.createReadStream(filePath))

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bot ${process.env.bot_token}`,
          ...form.getHeaders(),
        },
        body: form,
      })

      if (!response.ok) {
        throw new Error(`Discord API error: ${response.status}`)
      }
    } else {
      // Regular message
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bot ${process.env.bot_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: message,
          embeds: embed ? [embed] : [],
        }),
      })

      if (!response.ok) {
        throw new Error(`Discord API error: ${response.status}`)
      }
    }

    console.log("✅ Discord mesajı başarıyla gönderildi!")
  } catch (error) {
    console.error("❌ Discord mesajı gönderilemedi:", error)
    throw error
  }
}

export async function sendFileToDiscord(filePath: string, channelId: string) {
  const FormData = require("form-data")
  const fs = require("fs")

  const form = new FormData()
  form.append("file", fs.createReadStream(filePath))

  const response = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bot ${process.env.bot_token}`,
      ...form.getHeaders(),
    },
    body: form,
  })

  if (!response.ok) {
    throw new Error(`Discord file upload error: ${response.status}`)
  }

  console.log("✅ Dosya Discord'a başarıyla gönderildi!")
}
