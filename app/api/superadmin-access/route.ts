import { type NextRequest, NextResponse } from "next/server"
import { withAuth, type AuthenticatedRequest } from "@/lib/auth-middleware"

async function handler(request: AuthenticatedRequest) {
  return NextResponse.json({ access: true })
}

export async function GET(request: NextRequest) {
  return withAuth("superadmin")(request as AuthenticatedRequest, handler)
}
