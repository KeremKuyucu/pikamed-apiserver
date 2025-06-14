import { type NextRequest, NextResponse } from "next/server"
import { AuthCheck } from "../../lib/auth"

export async function GET(request: NextRequest) {
  const authResult = await AuthCheck(request, "admin")
  if (authResult.error) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status })
  }
  return NextResponse.json({ access: true })
}
