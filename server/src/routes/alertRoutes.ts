import express from 'express';
import {
  getAllAlerts,
  getAlertById,
  createAlert,
  updateAlert,
  deleteAlert,
} from '../controllers/alertController';
import { verifyToken } from '../middleware/auth'; // Assuming you want to protect these routes

const router = express.Router();

// Apply verifyToken middleware to all alert routes
router.use(verifyToken);

router.get('/', getAllAlerts); // Get all alerts
router.get('/:id', getAlertById); // Get a single alert by ID
router.post('/', createAlert); // Create a new alert
router.put('/:id', updateAlert); // Update an alert
router.delete('/:id', deleteAlert); // Delete an alert

export default router;