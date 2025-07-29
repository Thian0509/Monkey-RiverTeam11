"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAlert = exports.updateAlert = exports.createAlert = exports.getAlertById = exports.getAllAlerts = void 0;
const Alert_1 = __importDefault(require("../models/Alert"));
const getAllAlerts = async (req, res) => {
    try {
        const alerts = await Alert_1.default.find({}).sort({ createdAt: -1 });
        res.status(200).json({ message: "Alerts fetched successfully", alerts });
    }
    catch (error) {
        console.error("Error fetching alerts:", error);
        res
            .status(500)
            .json({ message: "Internal server error", error: error.message });
    }
};
exports.getAllAlerts = getAllAlerts;
const getAlertById = async (req, res) => {
    try {
        const { id } = req.params;
        const alert = await Alert_1.default.findById(id);
        if (!alert) {
            return res.status(404).json({ message: "Alert not found" });
        }
        res.status(200).json({ message: "Alert fetched successfully", alert });
    }
    catch (error) {
        console.error("Error fetching alert:", error);
        res
            .status(500)
            .json({ message: "Internal server error", error: error.message });
    }
};
exports.getAlertById = getAlertById;
const createAlert = async (req, res) => {
    try {
        const newAlert = req.body;
        const alert = await Alert_1.default.create(newAlert);
        res.status(201).json({ message: "Alert created successfully", alert });
    }
    catch (error) {
        console.error("Error creating alert:", error);
        res
            .status(500)
            .json({ message: "Internal server error", error: error.message });
    }
};
exports.createAlert = createAlert;
const updateAlert = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;
        const alert = await Alert_1.default.findByIdAndUpdate(id, updatedData, {
            new: true,
            runValidators: true,
        });
        if (!alert) {
            return res.status(404).json({ message: "Alert not found" });
        }
        res.status(200).json({ message: "Alert updated successfully", alert });
    }
    catch (error) {
        console.error("Error updating alert:", error);
        res
            .status(500)
            .json({ message: "Internal server error", error: error.message });
    }
};
exports.updateAlert = updateAlert;
const deleteAlert = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Alert_1.default.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).json({ message: "Alert not found" });
        }
        res.status(200).json({ message: "Alert deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting alert:", error);
        res
            .status(500)
            .json({ message: "Internal server error", error: error.message });
    }
};
exports.deleteAlert = deleteAlert;
