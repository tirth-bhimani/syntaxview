import mongoose, { Schema, Document, models, model } from "mongoose";

export interface IOtpToken extends Document {
  email: string;
  code: string;
  expiresAt: Date;
}

const OtpTokenSchema = new Schema<IOtpToken>({
  email: { type: String, required: true, lowercase: true },
  code: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

// Auto-delete expired documents
OtpTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const OtpToken =
  models.OtpToken || model<IOtpToken>("OtpToken", OtpTokenSchema);
