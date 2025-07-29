import { Request, Response } from "express";
import Alert, { IAlert } from "../models/Alert";

export const getAllAlerts = async (req: Request, res: Response) => {
  try {
    const alerts = await Alert.find({}).sort({ createdAt: -1 });
    res.status(200).json({ message: "Alerts fetched successfully", alerts });
  } catch (error: any) {
    console.error("Error fetching alerts:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const getAlertById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const alert = await Alert.findById(id);
    if (!alert) {
      return res.status(404).json({ message: "Alert not found" });
    }
    res.status(200).json({ message: "Alert fetched successfully", alert });
  } catch (error: any) {
    console.error("Error fetching alert:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const createAlert = async (req: Request, res: Response) => {
  try {
    const newAlert: IAlert = req.body;
    const alert = await Alert.create(newAlert);
    res.status(201).json({ message: "Alert created successfully", alert });
  } catch (error: any) {
    console.error("Error creating alert:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const updateAlert = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const alert = await Alert.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });
    if (!alert) {
      return res.status(404).json({ message: "Alert not found" });
    }
    res.status(200).json({ message: "Alert updated successfully", alert });
  } catch (error: any) {
    console.error("Error updating alert:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const deleteAlert = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await Alert.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: "Alert not found" });
    }
    res.status(200).json({ message: "Alert deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting alert:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
