import { initializeApp, getApps, cert } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"

const firebaseAdminConfig = {
  type: process.env.pikamed_FIREBASE_TYPE,
  project_id: process.env.pikamed_FIREBASE_PROJECT_ID,
  private_key_id: process.env.pikamed_FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.pikamed_FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  client_email: process.env.pikamed_FIREBASE_CLIENT_EMAIL,
  client_id: process.env.pikamed_FIREBASE_CLIENT_ID,
  auth_uri: process.env.pikamed_FIREBASE_AUTH_URI,
  token_uri: process.env.pikamed_FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.pikamed_FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.pikamed_FIREBASE_CLIENT_X509_CERT_URL,
  universe_domain: process.env.pikamed_FIREBASE_UNIVERSE_DOMAIN,
}

// Initialize Firebase Admin SDK
if (!getApps().length) {
  try {
    initializeApp({
      credential: cert(firebaseAdminConfig as any),
    })
    console.log("✅ Firebase Admin SDK initialized successfully")
  } catch (error) {
    console.error("❌ Failed to initialize Firebase Admin SDK:", error)
  }
}

export const adminAuth = getAuth()
