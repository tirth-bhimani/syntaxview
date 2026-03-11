import mongoose, { Schema, Document, models, model } from "mongoose";

export interface IUser extends Document {
  name?: string;
  email: string;
  password?: string;
  image?: string;
  emailVerified?: Date;
  theme?: "dark" | "light" | "system";
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String },
    image: { type: String },
    emailVerified: { type: Date },
    theme: { type: String, enum: ["dark", "light", "system"], default: "dark" },
  },
  { timestamps: true }
);

export const User = models.User || model<IUser>("User", UserSchema);
