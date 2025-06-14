import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    status: "Server çalışıyor",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  })
}
