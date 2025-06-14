import { NextResponse } from "next/server"

// CORS configuration
const ALLOWED_ORIGINS = [
  "https://pikamed-panel.keremkk.com.tr",
  "https://pikamed.keremkk.com.tr",
  "http://localhost:3000",
  "http://localhost:3001",
  "https://localhost:3000",
  "https://localhost:3001",
]

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*", // Will be set dynamically
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
  "Access-Control-Allow-Credentials": "true",
  "Access-Control-Max-Age": "86400", // 24 hours
}

export function corsHeaders(origin?: string | null) {
  const allowedOrigin = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0]

  return {
    ...CORS_HEADERS,
    "Access-Control-Allow-Origin": allowedOrigin,
  }
}

export function handleCors(request: Request) {
  const origin = request.headers.get("origin")

  // Handle preflight requests
  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 200,
      headers: corsHeaders(origin),
    })
  }

  return null
}

export function addCorsHeaders(response: NextResponse, origin?: string | null) {
  const headers = corsHeaders(origin)

  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  return response
}
