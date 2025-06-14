import { type NextRequest, NextResponse } from "next/server"
import { AuthCheck } from "../../lib/auth"
import { handleCors, addCorsHeaders } from "../../lib/cors"

export async function OPTIONS(request: NextRequest) {
  return handleCors(request) || new NextResponse(null, { status: 200 })
}

export async function GET(request: NextRequest) {
  const corsResponse = handleCors(request)
  if (corsResponse) return corsResponse

  const authResult = await AuthCheck(request, "superadmin")
  if (authResult.error) {
    const errorResponse = NextResponse.json({ error: authResult.error }, { status: authResult.status })
    return addCorsHeaders(errorResponse, request.headers.get("origin"))
  }

  const response = NextResponse.json({ access: true })
  return addCorsHeaders(response, request.headers.get("origin"))
}
