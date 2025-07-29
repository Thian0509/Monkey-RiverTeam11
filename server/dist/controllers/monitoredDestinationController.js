"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDestination = exports.updateDestination = exports.getDestinationById = exports.getAllDestinations = exports.createDestination = void 0;
const MonitoredDestination_1 = __importDefault(require("../models/MonitoredDestination"));
const createDestination = async (req, res) => {
    try {
        const newDestination = req.body;
        const destination = await MonitoredDestination_1.default.create(newDestination);
        res.status(201).json({
            message: "Monitored destination created successfully",
            destination,
        });
    }
    catch (error) {
        console.error("Error creating monitored destination:", error);
        res
            .status(500)
            .json({ message: "Internal server error", error: error.message });
    }
};
exports.createDestination = createDestination;
const getAllDestinations = async (req, res) => {
    try {
        const destinations = await MonitoredDestination_1.default.find({});
        res.status(200).json({
            message: "Monitored destinations fetched successfully",
            destinations,
        });
    }
    catch (error) {
        console.error("Error fetching monitored destinations:", error);
        res
            .status(500)
            .json({ message: "Internal server error", error: error.message });
    }
};
exports.getAllDestinations = getAllDestinations;
const getDestinationById = async (req, res) => {
    try {
        const { id } = req.params;
        const destination = await MonitoredDestination_1.default.findById(id);
        if (!destination) {
            return res
                .status(404)
                .json({ message: "Monitored destination not found" });
        }
        res.status(200).json({
            message: "Monitored destination fetched successfully",
            destination,
        });
    }
    catch (error) {
        console.error("Error fetching monitored destination:", error);
        res
            .status(500)
            .json({ message: "Internal server error", error: error.message });
    }
};
exports.getDestinationById = getDestinationById;
const updateDestination = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;
        const destination = await MonitoredDestination_1.default.findByIdAndUpdate(id, updatedData, { new: true, runValidators: true });
        if (!destination) {
            return res
                .status(404)
                .json({ message: "Monitored destination not found" });
        }
        res.status(200).json({
            message: "Monitored destination updated successfully",
            destination,
        });
    }
    catch (error) {
        console.error("Error updating monitored destination:", error);
        res
            .status(500)
            .json({ message: "Internal server error", error: error.message });
    }
};
exports.updateDestination = updateDestination;
const deleteDestination = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await MonitoredDestination_1.default.findByIdAndDelete(id);
        if (!result) {
            return res
                .status(404)
                .json({ message: "Monitored destination not found" });
        }
        res
            .status(200)
            .json({ message: "Monitored destination deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting monitored destination:", error);
        res
            .status(500)
            .json({ message: "Internal server error", error: error.message });
    }
};
exports.deleteDestination = deleteDestination;
