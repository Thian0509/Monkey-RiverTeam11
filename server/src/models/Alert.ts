import mongoose from "mongoose";

const alertSchema = new mongoose.Schema(
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

export default mongoose.model("Alert", alertSchema, "alerts");
