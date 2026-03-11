import { auth } from "@/lib/auth";
import connectDB from "@/lib/mongoose";
import { User } from "@/models/User";
import { OtpToken } from "@/models/OtpToken";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { code, newPassword } = await req.json();

    if (!code || !newPassword) {
      return NextResponse.json(
        { error: "Verification code and new password are required" },
        { status: 400 }
      );
    }
    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    await connectDB();
    const user = await User.findById(session.user.id);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Find valid OTP
    const otpRecord = await OtpToken.findOne({
      email: user.email,
      code,
      expiresAt: { $gt: new Date() },
    });

    if (!otpRecord) {
      return NextResponse.json(
        { error: "Invalid or expired verification code" },
        { status: 400 }
      );
    }

    // Update password
    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    // Delete used OTP
    await OtpToken.deleteMany({ email: user.email });

    return NextResponse.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Verify OTP error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
