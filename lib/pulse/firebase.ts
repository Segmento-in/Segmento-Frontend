// Pulse Firebase Configuration
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const pulseFirebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_PULSE_FIREBASE_API_KEY!,
    authDomain: process.env.NEXT_PUBLIC_PULSE_FIREBASE_AUTH_DOMAIN!,
    databaseURL: process.env.NEXT_PUBLIC_PULSE_FIREBASE_DATABASE_URL!,
    projectId: process.env.NEXT_PUBLIC_PULSE_FIREBASE_PROJECT_ID!,
    storageBucket: process.env.NEXT_PUBLIC_PULSE_FIREBASE_STORAGE_BUCKET!,
    messagingSenderId: process.env.NEXT_PUBLIC_PULSE_FIREBASE_MESSAGING_SENDER_ID!,
    appId: process.env.NEXT_PUBLIC_PULSE_FIREBASE_APP_ID!
};

// Initialize Pulse Firebase app with a unique name
const pulseApp = initializeApp(pulseFirebaseConfig, "pulse");

export const pulseAuth = getAuth(pulseApp);
export const database = getDatabase(pulseApp); // Firebase Realtime Database for view counting
