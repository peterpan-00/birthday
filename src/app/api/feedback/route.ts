import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid request payload." },
        { status: 400 }
      );
    }

    const { name, email, message, section, honeypot } = body;

    // Honeypot check for spam bots
    if (honeypot) {
      return NextResponse.json({ success: true });
    }

    // Message validation
    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json(
        { error: "Message is required." },
        { status: 422 }
      );
    }

    if (message.length > 5000) {
      return NextResponse.json(
        { error: "Message must be under 5,000 characters." },
        { status: 422 }
      );
    }

    // Email validation (optional, but must be valid if given)
    const trimmedEmail = typeof email === "string" ? email.trim() : "";
    if (trimmedEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedEmail) || trimmedEmail.length > 254) {
        return NextResponse.json(
          { error: "Please enter a valid email address." },
          { status: 422 }
        );
      }
    }

    const trimmedName = typeof name === "string" ? name.trim().slice(0, 100) : "";
    const trimmedSection = typeof section === "string" ? section.trim().slice(0, 100) : "General";
    const timestamp = new Date().toUTCString();

    const toEmail = process.env.FEEDBACK_TO_EMAIL || "otonge30@gmail.com";
    const fromEmail = process.env.FEEDBACK_FROM_EMAIL || "Birthday Experience <onboarding@resend.dev>";
    const resendApiKey = process.env.RESEND_API_KEY;

    if (resendApiKey) {
      // Live email transmission via Resend API
      const emailPayload: Record<string, unknown> = {
        from: fromEmail,
        to: [toEmail],
        subject: "Birthday Website Feedback",
        text: `Birthday Website Feedback\n\nName: ${trimmedName || "Anonymous"}\nEmail: ${trimmedEmail || "Not provided"}\nTimestamp: ${timestamp}\nSection: ${trimmedSection}\n\nMessage:\n${message.trim()}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #19141B; background-color: #FAF2EB; border-radius: 16px;">
            <h2 style="color: #72564D; margin-top: 0; font-size: 22px; font-weight: 700;">Birthday Website Feedback ✦</h2>
            <div style="background-color: #ffffff; padding: 18px; border-radius: 12px; margin-bottom: 20px; border: 1px solid rgba(217, 191, 138, 0.4);">
              <p style="margin: 6px 0; font-size: 14px;"><strong>From:</strong> ${escapeHtml(trimmedName || "Anonymous")}</p>
              <p style="margin: 6px 0; font-size: 14px;"><strong>Email:</strong> ${escapeHtml(trimmedEmail || "Not provided")}</p>
              <p style="margin: 6px 0; font-size: 14px;"><strong>Section:</strong> ${escapeHtml(trimmedSection)}</p>
              <p style="margin: 6px 0; font-size: 14px;"><strong>Time:</strong> ${timestamp}</p>
            </div>
            <div style="background-color: #ffffff; padding: 20px; border-radius: 12px; border: 1px solid rgba(217, 156, 165, 0.4);">
              <h3 style="margin-top: 0; color: #72564D; font-size: 15px; font-weight: 600;">Message:</h3>
              <p style="white-space: pre-wrap; font-size: 15px; line-height: 1.6; color: #271E29; margin: 0;">${escapeHtml(message.trim())}</p>
            </div>
            <p style="text-align: center; margin-top: 24px; font-size: 12px; color: #72564D; opacity: 0.7;">
              Cinematic Birthday Experience
            </p>
          </div>
        `,
      };

      if (trimmedEmail) {
        emailPayload.reply_to = trimmedEmail;
      }

      const resendRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailPayload),
      });

      if (!resendRes.ok) {
        const errorData = await resendRes.text();
        console.error("[FeedbackAPI] Resend provider returned error:", errorData);
        return NextResponse.json(
          { error: "Something went wrong. Please try again." },
          { status: 502 }
        );
      }

      return NextResponse.json({ success: true });
    }

    // Development or test mode without Resend API key configured
    console.log(`[FeedbackAPI] (Development Simulated Transmission)`);
    console.log(`Destination: ${toEmail}`);
    console.log(`From: ${trimmedName || "Anonymous"} <${trimmedEmail || "no-reply"}>`);
    console.log(`Message: ${message.trim().slice(0, 100)}...`);

    return NextResponse.json({
      success: true,
      simulated: true,
      note: "Email simulated: Set RESEND_API_KEY in production to deliver live emails.",
    });
  } catch (error) {
    console.error("[FeedbackAPI] Unexpected error processing feedback:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
