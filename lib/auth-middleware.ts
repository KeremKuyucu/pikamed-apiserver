import { type NextRequest, NextResponse } from "next/server"
import { adminAuth } from "./firebase-admin"

export interface AuthenticatedRequest extends NextRequest {
  user?: any
}

export function withAuth(requiredRole: string) {
  return async function authMiddleware(
    request: AuthenticatedRequest,
    handler: (req: AuthenticatedRequest) => Promise<NextResponse>,
  ) {
    const authHeader = request.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized: No token" }, { status: 401 })
    }

    const idToken = authHeader.split("Bearer ")[1]

    try {
      const decodedToken = await adminAuth.verifyIdToken(idToken)
      request.user = decodedToken

      // If no role is assigned, set default role to 'user'
      const userRole = request.user.role || "user"
      if (!request.user.role) {
        await adminAuth.setCustomUserClaims(request.user.uid, { role: "user" })
        request.user.role = "user"
      }

      // Role level check
      const roleToLevel: Record<string, number> = {
        user: 0,
        doctor: 1,
        admin: 3,
        superadmin: 5,
      }

      const userRoleLevel = roleToLevel[userRole] || 0
      const requiredRoleLevel = roleToLevel[requiredRole] || 0

      // Super admin bypass
      const superAdminUid = process.env.SUPER_ADMIN_UID
      const isSuperAdmin = request.user.uid === superAdminUid

      if (!isSuperAdmin && userRoleLevel < requiredRoleLevel) {
        return NextResponse.json(
          {
            error: `Forbidden: You need a role level of ${requiredRoleLevel} or higher`,
          },
          { status: 403 },
        )
      }

      return await handler(request)
    } catch (error) {
      console.error("Token verification error:", error)
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }
  }
}
