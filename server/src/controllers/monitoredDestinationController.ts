// src/controllers/monitoredDestinationController.ts
import { Request, Response } from "express";
import MonitoredDestination, {
  IMonitoredDestination,
} from "../models/MonitoredDestination";
import mongoose from "mongoose"; // <--- Add this import for mongoose.Types.ObjectId

// No need for mapRiskLevelToNumber/ToString helpers anymore, riskLevel is directly a number

export const createDestination = async (req: Request, res: Response) => {
  try {
    const { location, riskLevel, lastChecked } = req.body;

    // Basic validation
    // Risk level should be a number between 1 and 100
    if (!location || riskLevel === undefined || typeof riskLevel !== 'number' || riskLevel < 1 || riskLevel > 100) {
      return res.status(400).json({ message: "Location is required, and Risk Level must be a number between 1 and 100." });
    }

    // Check if location already exists
    const existingDestination = await MonitoredDestination.findOne({ location });
    if (existingDestination) {
      return res.status(409).json({ message: `Destination at '${location}' already exists.` });
    }

    const newDestinationData: IMonitoredDestination = {
      location,
      riskLevel: riskLevel, // Directly use the number
      lastChecked: lastChecked ? new Date(lastChecked) : new Date(),
    } as IMonitoredDestination;

    const destination = await MonitoredDestination.create(newDestinationData);

    res.status(201).json(destination.toObject()); // Return the created destination object directly
  } catch (error: any) {
    console.error("Error creating monitored destination:", error);
    if (error.code === 11000) {
      return res.status(409).json({ message: "A destination with this location already exists." });
    }
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const getAllDestinations = async (req: Request, res: Response) => {
  try {
    const destinations = await MonitoredDestination.find({});
    // No mapping needed for riskLevel as it's directly a number
    const formattedDestinations = destinations.map(d => {
      const obj = d.toObject();
      return {
        ...obj,
        // Explicitly cast _id to mongoose.Types.ObjectId to ensure .toString() is recognized
        _id: (obj._id as mongoose.Types.ObjectId).toString(),
      };
    });
    res.status(200).json(formattedDestinations);
  } catch (error: any) {
    console.error("Error fetching monitored destinations:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const getDestinationById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const destination = await MonitoredDestination.findById(id);
    if (!destination) {
      return res.status(404).json({ message: "Monitored destination not found" });
    }
    res.status(200).json(destination.toObject()); // Return the destination object directly
  } catch (error: any) {
    console.error("Error fetching monitored destination:", error);
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
        return res.status(400).json({ message: "Invalid destination ID format." });
    }
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const updateDestination = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { location, riskLevel, lastChecked } = req.body;

    const updateData: { location?: string; riskLevel?: number; lastChecked?: Date } = {};
    if (location !== undefined) updateData.location = location;
    if (riskLevel !== undefined) {
        // Validate riskLevel on update as well
        if (typeof riskLevel !== 'number' || riskLevel < 1 || riskLevel > 100) {
            return res.status(400).json({ message: "Risk Level must be a number between 1 and 100." });
        }
        updateData.riskLevel = riskLevel;
    }
    if (lastChecked !== undefined) updateData.lastChecked = new Date(lastChecked);

    const destination = await MonitoredDestination.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    if (!destination) {
      return res.status(404).json({ message: "Monitored destination not found" });
    }

    res.status(200).json(destination.toObject()); // Return the updated destination object directly
  } catch (error: any) {
    console.error("Error updating monitored destination:", error);
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
        return res.status(400).json({ message: "Invalid destination ID format." });
    }
    if (error.code === 11000) {
        return res.status(409).json({ message: "A destination with this location already exists." });
    }
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const deleteDestination = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await MonitoredDestination.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: "Monitored destination not found" });
    }
    res.status(200).json({ message: "Monitored destination deleted successfully", _id: id });
  } catch (error: any) {
    console.error("Error deleting monitored destination:", error);
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
        return res.status(400).json({ message: "Invalid destination ID format." });
    }
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};