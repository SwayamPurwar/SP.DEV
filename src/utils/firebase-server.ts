import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";

function getDatabaseUrl(): string {
  const databaseUrl = process.env.FIREBASE_ADMIN_DATABASE_URL || process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("Firebase database URL is missing. Set FIREBASE_ADMIN_DATABASE_URL or NEXT_PUBLIC_FIREBASE_DATABASE_URL.");
  }
  return databaseUrl;
}

function hasServiceAccount(): boolean {
  return Boolean(
    process.env.FIREBASE_ADMIN_PROJECT_ID &&
      process.env.FIREBASE_ADMIN_CLIENT_EMAIL &&
      process.env.FIREBASE_ADMIN_PRIVATE_KEY,
  );
}

export function getFirebaseAdminConfigStatus() {
  return {
    hasDatabaseUrl: Boolean(process.env.FIREBASE_ADMIN_DATABASE_URL || process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL),
    hasServiceAccount: hasServiceAccount(),
  };
}

function initAdminApp() {
  if (getApps().length) {
    return getApps()[0];
  }

  const databaseURL = getDatabaseUrl();

  if (hasServiceAccount()) {
    return initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replaceAll(String.raw`\n`, "\n"),
      }),
      databaseURL,
    });
  }

  throw new Error(
    "Firebase Admin credentials missing. Set FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, and FIREBASE_ADMIN_PRIVATE_KEY.",
  );
}

export function getServerDatabase() {
  const app = initAdminApp();
  return getDatabase(app);
}
