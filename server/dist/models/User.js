"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
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
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model("User", userSchema, "users");
