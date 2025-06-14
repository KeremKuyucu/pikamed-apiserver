import { type NextRequest, NextResponse } from "next/server"
import { withAuth, type AuthenticatedRequest } from "@/lib/auth-middleware"

async function handler(request: AuthenticatedRequest) {
  try {
    // Gerçek implementasyonda Firebase'den doktor rolündeki kullanıcıları çeker
    const mockDoctors = [
      { email: "doctor1@example.com", fullName: "Dr. John Smith" },
      { email: "doctor2@example.com", fullName: "Dr. Jane Doe" },
    ]

    return NextResponse.json({
      success: true,
      doctors: mockDoctors,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch doctors" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  return withAuth("admin")(request as AuthenticatedRequest, handler)
}
