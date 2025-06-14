import { type NextRequest, NextResponse } from "next/server"
import { withAuth, type AuthenticatedRequest } from "@/lib/auth-middleware"

async function handler(request: AuthenticatedRequest) {
  try {
    const body = await request.json()

    // Burada gerçek implementasyonda veriyi kaydetmek gerekir
    console.log("User info received:", body)

    return NextResponse.json({
      success: true,
      message: "User information saved successfully",
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  return withAuth("user")(request as AuthenticatedRequest, handler)
}
