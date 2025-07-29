"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            console.error("FATAL ERROR: MongoDB URI is not defined or is invalid in environment variables. Please check your .env file.");
            process.exit(1);
        }
        try {
            await mongoose_1.default.connect(mongoUri);
            console.log("✅ MongoDB connected successfully");
        }
        catch (error) {
            console.error("MongoDB connection failed:", error);
            process.exit(1);
        }
    }
    catch (error) {
        console.error("MongoDB connection failed:", error);
        process.exit(1);
    }
};
exports.default = connectDB;
