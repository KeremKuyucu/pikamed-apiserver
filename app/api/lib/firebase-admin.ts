import { initializeApp, getApps, cert, type App } from "firebase-admin/app"
import { getAuth, type Auth } from "firebase-admin/auth"

let app: App
let auth: Auth

function initializeFirebaseAdmin(): { app: App; auth: Auth } {
  // Eğer Firebase Admin zaten initialize edilmişse, mevcut instance'ı kullan
  if (getApps().length > 0) {
    app = getApps()[0]
    auth = getAuth(app)
    return { app, auth }
  }

  // Environment variables kontrolü
  const requiredEnvVars = [
    "PIKAMED_FIREBASE_PRIVATE_KEY_ID",
    "PIKAMED_FIREBASE_PRIVATE_KEY",
    "PIKAMED_FIREBASE_CLIENT_EMAIL",
    "PIKAMED_FIREBASE_CLIENT_ID",
    "PIKAMED_FIREBASE_CLIENT_X509_CERT_URL",
  ]

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`)
    }
  }

  try {
    // Firebase Admin SDK'yı initialize et
    app = initializeApp({
      credential: cert({
        type: "service_account",
        project_id: "marul-tarlasii",
        private_key_id: process.env.PIKAMED_FIREBASE_PRIVATE_KEY_ID,
        private_key: process.env.PIKAMED_FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        client_email: process.env.PIKAMED_FIREBASE_CLIENT_EMAIL,
        client_id: process.env.PIKAMED_FIREBASE_CLIENT_ID,
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://oauth2.googleapis.com/token",
        auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
        client_x509_cert_url: process.env.PIKAMED_FIREBASE_CLIENT_X509_CERT_URL,
        universe_domain: "googleapis.com",
      } as any),
    })

    auth = getAuth(app)

    console.log("✅ Firebase Admin SDK başarıyla initialize edildi")
    return { app, auth }
  } catch (error) {
    console.error("❌ Firebase Admin SDK initialize hatası:", error)
    throw new Error(`Firebase Admin SDK initialization failed: ${error}`)
  }
}

// Singleton pattern ile Firebase Admin instance'larını export et
const { app: firebaseApp, auth: firebaseAuth } = initializeFirebaseAdmin()

export { firebaseApp, firebaseAuth }
export default { app: firebaseApp, auth: firebaseAuth }
