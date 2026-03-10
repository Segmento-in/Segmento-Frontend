import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app"
import { getAuth, Auth } from "firebase/auth"
import { getDatabase, Database } from "firebase/database"
import { getFirestore, Firestore } from "firebase/firestore"

const pulseFirebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_PULSE_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_PULSE_FIREBASE_AUTH_DOMAIN!,
  databaseURL: process.env.NEXT_PUBLIC_PULSE_FIREBASE_DATABASE_URL!,
  projectId: process.env.NEXT_PUBLIC_PULSE_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_PULSE_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId:
    process.env.NEXT_PUBLIC_PULSE_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_PULSE_FIREBASE_APP_ID!,
}

let pulseApp: FirebaseApp
let pulseAuth: Auth
let database: Database
let db: Firestore

if (typeof window !== "undefined") {
  pulseApp =
    getApps().find((app) => app.name === "pulse") ??
    initializeApp(pulseFirebaseConfig, "pulse")

  pulseAuth = getAuth(pulseApp)
  database = getDatabase(pulseApp)
  db = getFirestore(pulseApp)
}

export { pulseAuth, database, db }
