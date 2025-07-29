import { Request, Response } from "express";
import MonitoredDestination, {
  IMonitoredDestination,
} from "../models/MonitoredDestination";

export const createDestination = async (req: Request, res: Response) => {
  try {
    const newDestination: IMonitoredDestination = req.body;
    const destination = await MonitoredDestination.create(newDestination);
    res
      .status(201)
      .json({
        message: "Monitored destination created successfully",
        destination,
      });
  } catch (error: any) {
    console.error("Error creating monitored destination:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const getAllDestinations = async (req: Request, res: Response) => {
  try {
    const destinations = await MonitoredDestination.find({});
    res
      .status(200)
      .json({
        message: "Monitored destinations fetched successfully",
        destinations,
      });
  } catch (error: any) {
    console.error("Error fetching monitored destinations:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const getDestinationById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const destination = await MonitoredDestination.findById(id);
    if (!destination) {
      return res
        .status(404)
        .json({ message: "Monitored destination not found" });
    }
    res
      .status(200)
      .json({
        message: "Monitored destination fetched successfully",
        destination,
      });
  } catch (error: any) {
    console.error("Error fetching monitored destination:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const updateDestination = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedData: IMonitoredDestination = req.body;
    const destination = await MonitoredDestination.findByIdAndUpdate(
      id,
      updatedData,
      { new: true, runValidators: true }
    );
    if (!destination) {
      return res
        .status(404)
        .json({ message: "Monitored destination not found" });
    }
    res
      .status(200)
      .json({
        message: "Monitored destination updated successfully",
        destination,
      });
  } catch (error: any) {
    console.error("Error updating monitored destination:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const deleteDestination = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await MonitoredDestination.findByIdAndDelete(id);
    if (!result) {
      return res
        .status(404)
        .json({ message: "Monitored destination not found" });
    }
    res
      .status(200)
      .json({ message: "Monitored destination deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting monitored destination:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
