// database.ts (No changes needed, keeping as is)
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      console.error(
        "FATAL ERROR: MongoDB URI is not defined or is invalid in environment variables. Please check your .env file."
      );
      process.exit(1);
    }

    try {
      await mongoose.connect(mongoUri);
      console.log("✅ MongoDB connected successfully");
    } catch (error) {
      console.error("MongoDB connection failed:", error);
      process.exit(1);
    }
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};

export default connectDB;