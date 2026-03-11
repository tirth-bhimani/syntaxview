import { auth } from "@/lib/auth";
import connectDB from "@/lib/mongoose";
import { User } from "@/models/User";
import { OtpToken } from "@/models/OtpToken";
import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const user = await User.findById(session.user.id);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  // Delete any existing OTPs for this user
  await OtpToken.deleteMany({ email: user.email });

  const code = generateOTP();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await OtpToken.create({ email: user.email, code, expiresAt });

  // Send email via Resend
  const { error } = await resend.emails.send({
    from: process.env.FROM_EMAIL || "onboarding@resend.dev",
    to: user.email,
    subject: "SyntaxView — Password Change Verification",
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; background: #000; color: #fff; border-radius: 16px; overflow: hidden; border: 1px solid rgba(6,182,212,0.2);">
        <div style="background: linear-gradient(135deg, #06b6d4, #a855f7); padding: 32px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px; font-weight: 800; color: #fff;">SyntaxView</h1>
          <p style="margin: 8px 0 0; color: rgba(255,255,255,0.8); font-size: 14px;">Password Change Verification</p>
        </div>
        <div style="padding: 32px; text-align: center;">
          <p style="color: rgba(255,255,255,0.7); font-size: 15px; margin: 0 0 24px;">
            You requested a password change. Use this verification code:
          </p>
          <div style="background: rgba(6,182,212,0.1); border: 2px solid rgba(6,182,212,0.3); border-radius: 12px; padding: 24px; margin: 0 0 24px; display: inline-block; width: 100%; box-sizing: border-box;">
            <span style="font-size: 42px; font-weight: 800; letter-spacing: 12px; color: #06b6d4; font-family: 'Courier New', monospace;">${code}</span>
          </div>
          <p style="color: rgba(255,255,255,0.4); font-size: 13px; margin: 0;">
            This code expires in <strong style="color: rgba(255,255,255,0.6);">10 minutes</strong>.<br/>
            If you didn't request this, please ignore this email.
          </p>
        </div>
      </div>
    `,
  });

  if (error) {
    console.error("Resend error:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }

  return NextResponse.json({
    message: `Verification code sent to ${user.email}`,
    email: user.email,
  });
}
