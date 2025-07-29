"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const alertSchema = new mongoose_1.default.Schema({
    type: { type: String, enum: ["info", "warning", "danger"], required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model("Alert", alertSchema, "alerts");
