import { NextRequest, NextResponse } from "next/server";
import { getFirebaseAdminConfigStatus, getServerDatabase } from "@/utils/firebase-server";

function isAuthorized(request: NextRequest): boolean {
  const configuredKey = process.env.ANALYTICS_DASHBOARD_KEY;
  if (!configuredKey) return false;

  const incomingKey = request.headers.get("x-dashboard-key") || "";
  return incomingKey === configuredKey;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const config = getFirebaseAdminConfigStatus();

  try {
    const db = getServerDatabase();
    await db.ref("analytics/events").limitToLast(1).once("value");

    return NextResponse.json({
      ok: true,
      adminConfigured: config.hasServiceAccount,
      databaseUrlConfigured: config.hasDatabaseUrl,
      databaseReachable: true,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      {
        ok: false,
        adminConfigured: config.hasServiceAccount,
        databaseUrlConfigured: config.hasDatabaseUrl,
        databaseReachable: false,
        error: message,
      },
      { status: 500 },
    );
  }
}
