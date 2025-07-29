import mongoose, { Document, Schema } from 'mongoose';

export interface IAlert extends Document {
  type: 'info' | 'warning' | 'danger';
  message: string;
  read: boolean;
  userId?: mongoose.Types.ObjectId;
}

const alertSchema = new mongoose.Schema<IAlert>(
  {
    type: { type: String, enum: ["info", "warning", "danger"], required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IAlert>("Alert", alertSchema, "alerts");