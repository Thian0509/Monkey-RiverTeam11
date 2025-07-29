import mongoose, { Document, Schema } from "mongoose";

export interface IMonitoredDestination extends Document {
  location: string;
  riskLevel: "Low" | "Medium" | "High" | "Critical";
  lastChecked: Date;
}

const MonitoredDestinationSchema: Schema = new Schema(
  {
    location: { type: String, required: true, trim: true },
    riskLevel: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Low",
      required: true,
    },
    lastChecked: { type: Date, required: true, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IMonitoredDestination>(
  "MonitoredDestination",
  MonitoredDestinationSchema,
  "monitoredDestinations"
);
