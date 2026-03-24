import { Resend } from "resend";

// Vercel will automatically inject this environment variable securely
const resend = new Resend(import.meta.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, message } = req.body;

  try {
    const data = await resend.emails.send({
      // Resend allows you to use their testing domain until you add your own
      from: "System <onboarding@resend.dev>",
      to: "swayampurwar111104@gmail.com", // Your receiving email
      subject: `New Transmission from ${name}`,
      text: `Incoming Transmission!\n---------------------------\nName: ${name}\nEmail: ${email}\n\nMessage Payload:\n${message}`,
    });

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Resend Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
}
