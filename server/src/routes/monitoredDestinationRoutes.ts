// monitoredDestinationRoutes.ts (No changes needed, keeping as is)
import express from "express";
import {
  createDestination,
  getAllDestinations,
  getDestinationById,
  updateDestination,
  deleteDestination,
} from "../controllers/monitoredDestinationController";
import { verifyToken } from "../middleware/auth"; // Your existing auth middleware

const router = express.Router();

router.use(verifyToken);

router.post("/", createDestination);
router.get("/", getAllDestinations);
router.get("/:id", getDestinationById); // :id will be MongoDB's _id
router.put("/:id", updateDestination);   // :id will be MongoDB's _id
router.delete("/:id", deleteDestination); // :id will be MongoDB's _id

export default router;