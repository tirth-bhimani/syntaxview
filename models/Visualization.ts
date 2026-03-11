import mongoose, { Schema, Document, models, model, Types } from "mongoose";

export interface IVisualization extends Document {
  userId: Types.ObjectId;
  type: string;
  name: string;
  data: object;
  createdAt: Date;
  updatedAt: Date;
}

const VisualizationSchema = new Schema<IVisualization>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: { type: String, required: true },
    name: { type: String, required: true },
    data: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

export const Visualization =
  models.Visualization || model<IVisualization>("Visualization", VisualizationSchema);
