import { auth } from "@/lib/auth";
import connectDB from "@/lib/mongoose";
import { User } from "@/models/User";
import { NextResponse } from "next/server";

// GET — fetch profile
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const user = await User.findById(session.user.id).select("-password");
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
  return NextResponse.json(user);
}

// PATCH — update name / email / theme
export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();

  try {
    const { name, email, theme } = await req.json();
    const user = await User.findById(session.user.id);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Uniqueness check if email changed
    if (email && email.toLowerCase() !== user.email) {
      const exists = await User.findOne({ email: email.toLowerCase() });
      if (exists) {
        return NextResponse.json({ error: "This email is already in use" }, { status: 409 });
      }
      user.email = email.toLowerCase();
    }
    if (name?.trim()) user.name = name.trim();
    if (theme && ["dark", "light", "system"].includes(theme)) user.theme = theme;

    await user.save();
    return NextResponse.json({
      message: "Profile updated",
      user: { id: user._id, name: user.name, email: user.email, theme: user.theme },
    });
  } catch (err) {
    console.error("Settings PATCH error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

// DELETE — delete account
export async function DELETE() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  await User.findByIdAndDelete(session.user.id);
  return NextResponse.json({ message: "Account deleted" });
}
