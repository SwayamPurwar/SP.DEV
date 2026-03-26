// src/app/api/contact/route.ts
import { NextResponse } from "next/server";

// We specifically export a POST function to handle POST requests
export async function POST(request: Request) {
  try {
    // Parse the incoming JSON payload from your Contact page
    const body = await request.json();
    const { name, email, message } = body;

    // Basic Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    console.log("Contact Form Submission Received:", { name, email, message });

    // ==========================================
    // TODO: Add your email sending logic here!
    // e.g., using Resend, SendGrid, or Nodemailer
    // ==========================================

    return NextResponse.json(
      { success: true, message: "Transmission received successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}