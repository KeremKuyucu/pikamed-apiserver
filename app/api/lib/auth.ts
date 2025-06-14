import type { NextRequest } from "next/server"
import { getAuth } from "firebase-admin/auth"
import { sendMessageToDiscord } from "./discord-utils"

interface AuthResult {
  error?: string
  status?: number
  user?: any
}

function roleToLevel(role: string): number {
  const roles: Record<string, number> = {
    user: 0,
    doctor: 1,
    admin: 3,
    superadmin: 5,
  }
  return roles[role] || 0
}

export async function AuthCheck(request: NextRequest, requiredRole: string): Promise<AuthResult> {
  const authHeader = request.headers.get("authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { error: "Unauthorized: No token", status: 401 }
  }

  const idToken = authHeader.split("Bearer ")[1]

  try {
    const decodedToken = await getAuth().verifyIdToken(idToken)

    const userRole = decodedToken.role
    if (!userRole) {
      await getAuth().setCustomUserClaims(decodedToken.uid, { role: "user" })
      decodedToken.role = "user"
      console.log(`Kullanıcı ${decodedToken.uid} için rol 'user' olarak güncellendi.`)
    }

    const superAdminUid = "HJZGLEgh1scqmChOj3Pq2eg7QhR2"
    const isSuperAdmin = decodedToken.uid === superAdminUid
    const userRoleLevel = roleToLevel(decodedToken.role)
    const requiredRoleLevel = roleToLevel(requiredRole)

    if (!isSuperAdmin && userRoleLevel < requiredRoleLevel) {
      const embed = {
        title: "İzinsiz Erişim Denemesi",
        description: `Rol kontrolü başarısız`,
        fields: [
          {
            name: "Kişi Bilgileri",
            value: `**İsim:** ${decodedToken.name || "Bilinmiyor"}\n**UID:** \`${decodedToken.uid}\`\n**Mevcut İzin:** ${decodedToken.role}\n**Gerekli İzin:** ${requiredRole}`,
            inline: false,
          },
        ],
        thumbnail: { url: decodedToken?.photoUrl || "" },
        color: 0xff0000,
        timestamp: new Date(),
      }

      await sendMessageToDiscord("İzinsiz Giriş Denemesi", "1367428890271944745", embed)
      return { error: `Forbidden: You need a role level of ${requiredRoleLevel} or higher`, status: 403 }
    }

    const embed = {
      title: "Başarılı Giriş",
      description: `Giriş başarılı`,
      fields: [
        {
          name: "Kişi Bilgileri",
          value: `**İsim:** ${decodedToken.name || "Bilinmiyor"}\n**UID:** \`${decodedToken.uid}\`\n**Mevcut İzin:** ${decodedToken.role}\n**Gerekli İzin:** ${requiredRole}`,
          inline: false,
        },
      ],
      thumbnail: { url: decodedToken?.photoUrl || "" },
      color: 0x00ff00,
      timestamp: new Date(),
    }

    await sendMessageToDiscord("Başarılı Giriş", "1366783878496518316", embed)

    return { user: decodedToken }
  } catch (error) {
    console.error("Token doğrulama hatası:", error)
    await sendMessageToDiscord(`Yanlış token geldi: ${error}`, "1367428890271944745", null)
    return { error: "Invalid token", status: 401 }
  }
}
