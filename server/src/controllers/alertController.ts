import { Request, Response } from 'express';
import Alert, { IAlert } from '../models/Alert'; // Assuming IAlert is defined in Alert.ts

// Get all alerts (for the dashboard display)
export const getAllAlerts = async (req: Request, res: Response) => {
  try {
    // Optionally, filter by user if alerts are user-specific
    // const userId = (req as any).user?.userId; // Assuming you're using verifyToken middleware
    // const query = userId ? { userId } : {};

    const alerts = await Alert.find({}).sort({ createdAt: -1 }); // Sort by newest first
    res.status(200).json({ message: 'Alerts fetched successfully', alerts });
  } catch (error: any) {
    console.error('Error fetching alerts:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Get a single alert by ID
export const getAlertById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const alert = await Alert.findById(id);
    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }
    res.status(200).json({ message: 'Alert fetched successfully', alert });
  } catch (error: any) {
    console.error('Error fetching alert:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Create a new alert (useful for seeding data or admin tools)
export const createAlert = async (req: Request, res: Response) => {
  try {
    const newAlert: IAlert = req.body;
    // Optionally, set userId from authenticated user
    // if ((req as any).user?.userId) {
    //   newAlert.userId = (req as any).user.userId;
    // }
    const alert = await Alert.create(newAlert);
    res.status(201).json({ message: 'Alert created successfully', alert });
  } catch (error: any) {
    console.error('Error creating alert:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Update an alert (e.g., mark as read)
export const updateAlert = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const alert = await Alert.findByIdAndUpdate(id, updatedData, { new: true, runValidators: true });
    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }
    res.status(200).json({ message: 'Alert updated successfully', alert });
  } catch (error: any) {
    console.error('Error updating alert:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Delete an alert
export const deleteAlert = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await Alert.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: 'Alert not found' });
    }
    res.status(200).json({ message: 'Alert deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting alert:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};