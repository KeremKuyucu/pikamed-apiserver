import { type NextRequest, NextResponse } from "next/server"
import { AuthCheck } from "../../lib/auth"
import { getAuth } from "firebase-admin/auth"

export async function POST(request: NextRequest) {
  try {
    const authResult = await AuthCheck(request, "admin")
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

    const { uid, doctorEmail } = await request.json()

    try {
      const userRecord = await getAuth().getUserByEmail(doctorEmail)
      await getAuth().setCustomUserClaims(userRecord.uid, { role: "doctor" })

      return NextResponse.json({
        success: true,
        message: "Doktor rolü başarıyla atandı!",
      })
    } catch (error: any) {
      return NextResponse.json(
        {
          success: false,
          message: `Hata: ${error.message}`,
        },
        { status: 404 },
      )
    }
  } catch (error) {
    console.error("Add doctor error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
