import { NextResponse } from "next/server";

interface ContactPayload {
  name: string;
  email: string;
  message: string;
  company?: string;
}

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const submissionStore = new Map<string, RateLimitEntry>();

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  return "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const existing = submissionStore.get(ip);

  if (!existing || existing.resetAt < now) {
    submissionStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (existing.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  existing.count += 1;
  submissionStore.set(ip, existing);
  return false;
}

function toSafeString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function validatePayload(payload: ContactPayload): string | null {
  if (!payload.name || payload.name.length < 2 || payload.name.length > 80) {
    return "Name must be between 2 and 80 characters.";
  }

  if (!payload.email || !EMAIL_REGEX.test(payload.email) || payload.email.length > 160) {
    return "Email must be valid and under 160 characters.";
  }

  if (!payload.message || payload.message.length < 10 || payload.message.length > 3000) {
    return "Message must be between 10 and 3000 characters.";
  }

  return null;
}

async function sendViaResend(payload: ContactPayload): Promise<{ ok: boolean; status: number }> {
  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL;
  const fromEmail = process.env.CONTACT_FROM_EMAIL || "onboarding@resend.dev";

  if (!apiKey || !toEmail) {
    return { ok: false, status: 0 };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [toEmail],
      reply_to: payload.email,
      subject: `New portfolio inquiry from ${payload.name}`,
      text: [
        `Name: ${payload.name}`,
        `Email: ${payload.email}`,
        "",
        "Message:",
        payload.message,
      ].join("\n"),
    }),
  });

  return { ok: response.ok, status: response.status };
}

export async function POST(request: Request) {
  const ip = getClientIp(request);

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again later." },
      { status: 429 }
    );
  }

  try {
    const body: unknown = await request.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    const record = body as Record<string, unknown>;
    const payload: ContactPayload = {
      name: toSafeString(record.name),
      email: toSafeString(record.email).toLowerCase(),
      message: toSafeString(record.message),
      company: toSafeString(record.company),
    };

    // Honeypot field. Bots filling this field are silently accepted and dropped.
    if (payload.company) {
      return NextResponse.json(
        { success: true, message: "Transmission received successfully" },
        { status: 200 }
      );
    }

    const validationError = validatePayload(payload);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const hasEmailConfig = Boolean(process.env.RESEND_API_KEY && process.env.CONTACT_TO_EMAIL);

    if (!hasEmailConfig) {
      if (process.env.NODE_ENV === "production") {
        console.error("Contact API is missing required email configuration.");
        return NextResponse.json(
          { error: "Contact delivery is currently unavailable." },
          { status: 503 }
        );
      }

      console.info("Contact form received in development mode:", {
        name: payload.name,
        email: payload.email,
        messageLength: payload.message.length,
      });

      return NextResponse.json(
        { success: true, message: "Transmission received successfully", mocked: true },
        { status: 200 }
      );
    }

    const delivery = await sendViaResend(payload);

    if (!delivery.ok) {
      console.error("Email delivery failed.", { status: delivery.status });
      return NextResponse.json(
        { error: "Unable to deliver your message right now." },
        { status: 502 }
      );
    }

    console.info("Contact Form Submission Delivered:", {
      name: payload.name,
      email: payload.email,
      messageLength: payload.message.length,
      ip,
    });

    return NextResponse.json(
      { success: true, message: "Transmission received successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact API Route Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}