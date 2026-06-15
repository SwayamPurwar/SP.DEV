import { NextResponse } from "next/server";
import { getServerDatabase } from "@/utils/firebase-server";

export async function GET() {
  try {
    const db = getServerDatabase();
    const guestbookRef = db.ref("guestbook");

    // Fetch the latest 50 messages from Realtime Database
    const snapshot = await guestbookRef.orderByChild("timestamp").limitToLast(50).once("value");
    const data = snapshot.val();

    const messages = [];
    if (data) {
      // Convert the Firebase object into an array
      for (const [key, value] of Object.entries(data)) {
        messages.push({
          id: key,
          ...(value as any),
        });
      }
    }

    // Sort to show the newest messages at the top
    messages.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return NextResponse.json({ success: true, messages });
  } catch (error) {
    console.error("Guestbook GET Error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch logs" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, message } = body;

    if (!name || !message) {
      return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });
    }

    const newEntry = {
      name: name.trim().substring(0, 50),
      message: message.trim().substring(0, 500),
      timestamp: new Date().toISOString(),
    };

    const db = getServerDatabase();
    const guestbookRef = db.ref("guestbook");

    // Push the new entry to the Realtime Database
    const newDocRef = await guestbookRef.push(newEntry);

    return NextResponse.json({ success: true, entry: { id: newDocRef.key, ...newEntry } });
  } catch (error) {
    console.error("Guestbook POST Error:", error);
    return NextResponse.json({ success: false, error: "Failed to post log" }, { status: 500 });
  }
}