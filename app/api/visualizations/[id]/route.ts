import { auth } from "@/lib/auth";
import connectDB from "@/lib/mongoose";
import { Visualization } from "@/models/Visualization";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  await connectDB();
  const viz = await Visualization.findOne({ _id: id, userId: session.user.id });
  if (!viz) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(viz);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  await connectDB();
  const viz = await Visualization.findOneAndDelete({ _id: id, userId: session.user.id });
  if (!viz) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ message: "Deleted" });
}
