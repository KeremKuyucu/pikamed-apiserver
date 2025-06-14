import { type NextRequest, NextResponse } from "next/server"
import { withAuth, type AuthenticatedRequest } from "@/lib/auth-middleware"

async function handler(request: AuthenticatedRequest) {
  try {
    const body = await request.json()
    const { message, uid } = body

    // Simulate API response delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Gerçek implementasyonda burada Gemini API'ye istek atılır
    const aiResponse = `Bu, "${message}" sorunuza mock bir yanıttır. Gerçek implementasyonda bu Gemini API tarafından işlenecektir.`

    return NextResponse.json({ aiResponse })
  } catch (error) {
    console.error("AI API error:", error)
    return NextResponse.json({ error: "AI API request failed" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  return withAuth("user")(request as AuthenticatedRequest, handler)
}
