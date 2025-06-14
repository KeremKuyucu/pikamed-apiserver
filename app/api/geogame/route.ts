import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: "GeoGame API is running",
    endpoints: ["Add your geogame endpoints here"],
  })
}
