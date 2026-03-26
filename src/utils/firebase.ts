import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// --- SAFEGUARD: Check if the config is loaded properly ---
if (typeof window !== "undefined" && !firebaseConfig.projectId) {
  console.error(
    "🔥 FIREBASE ERROR: Environment variables are missing! " +
    "Make sure your .env.local file is in the root directory and starts with NEXT_PUBLIC_"
  );
}

// Initialize Firebase ONLY if it hasn't been initialized yet
// And only if we actually have a config to pass it
const app = !getApps().length && firebaseConfig.projectId 
    ? initializeApp(firebaseConfig) 
    : getApp();

export const db = getDatabase(app);