// src/models/MonitoredDestination.ts
import mongoose, { Document, Schema, Model } from "mongoose";

export interface IMonitoredDestinationBase {
  location: string;
  riskLevel: number; // This will now be a number from 1 to 100
  lastChecked: Date;
}

export interface IMonitoredDestination extends IMonitoredDestinationBase, Document {}

const MonitoredDestinationSchema: Schema = new Schema(
  {
    location: { type: String, required: true, trim: true, unique: true },
    riskLevel: {
      type: Number,
      required: true,
      default: 50, // Default to a middle value, e.g., 50
      min: 1,    // Minimum risk level
      max: 100,  // Maximum risk level
    },
    lastChecked: { type: Date, required: true, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const MonitoredDestination: Model<IMonitoredDestination> = mongoose.model<IMonitoredDestination>(
  "MonitoredDestination",
  MonitoredDestinationSchema,
  "monitoredDestinations"
);

export default MonitoredDestination;