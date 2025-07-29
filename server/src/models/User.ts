import mongoose from "mongoose";

export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  passwordHash: string;
  role: "admin" | "participant";
  receiveEmailNotifications: boolean;
  notificationThreshold: number;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "participant"],
      default: "participant",
    },
    receiveEmailNotifications: { type: Boolean, default: true },
    notificationThreshold: { type: Number, default: 5 },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUser>("User", userSchema, "users");
