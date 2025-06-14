import { type NextRequest, NextResponse } from "next/server"
import { withAuth, type AuthenticatedRequest } from "@/lib/auth-middleware"

async function handler(request: AuthenticatedRequest) {
  try {
    // Gerçek implementasyonda Firebase'den kullanıcıları çeker
    const mockUsers = [
      { email: "patient1@example.com", displayName: "Patient One", uid: "user1" },
      { email: "patient2@example.com", displayName: "Patient Two", uid: "user2" },
      { email: "patient3@example.com", displayName: "Patient Three", uid: "user3" },
    ]

    return NextResponse.json({
      success: true,
      patients: mockUsers,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  return withAuth("doctor")(request as AuthenticatedRequest, handler)
}
