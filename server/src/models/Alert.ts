// src/models/Alert.ts
import mongoose, { Document, Schema, Model } from "mongoose";

export interface IAlertBase {
  type: "info" | "warning" | "danger";
  message: string;
  read: boolean;
  timestamp: Date; // Added: Crucial for notifications to have a timestamp
  userId: mongoose.Types.ObjectId; // Changed to required as notifications are user-specific
}

// Extend Mongoose's Document type
export interface IAlert extends IAlertBase, Document {}

const alertSchema = new mongoose.Schema<IAlert>(
  {
    type: { type: String, enum: ["info", "warning", "danger"], required: true, default: "info" }, // Added default
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    timestamp: { type: Date, required: true, default: Date.now }, // Added: Default to current time
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true }, // Required and indexed
  },
  {
    timestamps: true, // Keeps createdAt and updatedAt
  }
);

export default mongoose.model<IAlert>("Alert", alertSchema, "alerts");