import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

interface ContactPayload {
  name?: string;
  email?: string;
  city?: string;
  message?: string;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export async function POST(request: Request) {
  let body: ContactPayload;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = body.name?.trim();
  const email = body.email?.trim();
  const city = body.city?.trim() ?? "";
  const message = body.message?.trim();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpUser || !smtpPass) {
    return NextResponse.json(
      { error: "Email service is not configured" },
      { status: 503 },
    );
  }

  const to = process.env.CONTACT_TO ?? "syedfahad.dev@gmail.com";
  const host = process.env.SMTP_HOST ?? "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT ?? 587);

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  const subject = `[Cursor India] Message from ${name}${city ? ` · ${city}` : ""}`;

  try {
    await transporter.sendMail({
      from: `"Cursor India" <${smtpUser}>`,
      to,
      replyTo: email,
      subject,
      text: [`Name: ${name}`, `Email: ${email}`, `City: ${city || "—"}`, "", message].join(
        "\n",
      ),
      html: `
        <div style="font-family: ui-sans-serif, system-ui, sans-serif; line-height: 1.6; color: #2D2C26;">
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>City:</strong> ${escapeHtml(city || "—")}</p>
          <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 20px 0;" />
          <p style="white-space: pre-wrap;">${escapeHtml(message)}</p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
