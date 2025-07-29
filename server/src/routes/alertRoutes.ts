// src/routes/alertRoutes.ts
import express from "express";
import {
  getAllAlerts,           // Renamed from getUserAlerts in my previous example to match your existing
  getAlertById,
  createAlert,
  markAlertAsRead,        // New: for marking single alert as read
  markAllUserAlertsAsRead, // New: for marking all user alerts as read
  deleteAlert,            // Adjusted to be user-specific
  // updateAlert, // You might not need a general updateAlert if markAsRead covers the main use case
} from "../controllers/alertController";
import { verifyToken } from "../middleware/auth"; // Your existing auth middleware

const router = express.Router();

router.use(verifyToken); // This applies authentication to all routes below

router.get("/", getAllAlerts);           // Fetch all alerts for the authenticated user
router.get("/:id", getAlertById);
router.post("/", createAlert);           // Create a new alert for the authenticated user
router.put("/mark-read/:id", markAlertAsRead); // Mark a specific alert as read
router.put("/mark-all-read", markAllUserAlertsAsRead); // Mark all alerts for the user as read
router.delete("/:id", deleteAlert);      // Delete a specific alert for the authenticated user

// If you still need a general update for alerts (beyond just 'read' status),
// you can keep/re-add this, but ensure it's also user-specific in the controller.
// router.put("/:id", updateAlert);

export default router;