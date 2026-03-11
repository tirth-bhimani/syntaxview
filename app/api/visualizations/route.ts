import { auth } from "@/lib/auth";
import connectDB from "@/lib/mongoose";
import { Visualization } from "@/models/Visualization";
import { NextResponse } from "next/server";
import { Types } from "mongoose";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const vizs = await Visualization.find({ userId: session.user.id }).sort({ updatedAt: -1 });
  return NextResponse.json(vizs);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { type, name, data } = await req.json();
    if (!type || !name || data === undefined) {
      return NextResponse.json({ error: "Type, name, and data are required" }, { status: 400 });
    }
    await connectDB();
    const viz = await Visualization.create({
      userId: new Types.ObjectId(session.user.id),
      type,
      name,
      data,
    });
    return NextResponse.json(viz, { status: 201 });
  } catch (err) {
    console.error("Save viz error:", err);
    return NextResponse.json({ error: "Failed to save visualization" }, { status: 500 });
  }
}
