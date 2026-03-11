import mongoose from "mongoose";
import dns from "dns";

// Use Google Public DNS to resolve MongoDB Atlas SRV records
// (local/ISP DNS may not support SRV lookups)
dns.setServers(["8.8.8.8", "8.8.4.4"]);

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your MONGODB_URI to .env");
}

const MONGODB_URI = process.env.MONGODB_URI;

declare global {
  // eslint-disable-next-line no-var
  var mongoose: { conn: typeof import("mongoose") | null; promise: Promise<typeof import("mongoose")> | null };
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((m) => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
