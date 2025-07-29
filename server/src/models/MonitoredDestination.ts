import mongoose, { Document, Schema } from "mongoose";

export interface IMonitoredDestination extends Document {
  location: string;
  riskLevel: number;
  lastChecked: Date;
}

const MonitoredDestinationSchema: Schema = new Schema(
  {
    location: { type: String, required: true, trim: true },
    riskLevel: { type: Number, required: true, default: 0 },
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
