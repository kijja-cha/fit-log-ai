// Use dynamic imports to avoid bundling issues
import { initializeApp, getApps, getApp } from 'firebase/app'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'

// Firebase configuration - requires environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Initialize Firebase app
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)

// Initialize Firebase services
export const db = getFirestore(app)

// Initialize analytics only on client side
export const analytics =
  typeof window !== 'undefined'
    ? import('firebase/analytics')
        .then(({ getAnalytics }) => getAnalytics(app))
        .catch(() => null)
    : null

// Development emulator setup
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  // Connect to emulators if running locally
  if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true') {
    try {
      connectFirestoreEmulator(db, 'localhost', 8080)
    } catch (error) {
      console.warn('Firebase emulator connection failed:', error)
    }
  }
}

export default app

// Collection names - centralized for easy management
export const COLLECTIONS = {
  USERS: 'users',
  RUN_LOGS: 'run_logs',
  STRENGTH_SESSIONS: 'strength_sessions',
  NUTRITION_LOGS: 'nutrition_logs',
} as const
