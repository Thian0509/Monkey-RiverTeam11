import express from "express";
import {
  getAllAlerts,
  getAlertById,
  createAlert,
  updateAlert,
  deleteAlert,
} from "../controllers/alertController";
import { verifyToken } from "../middleware/auth";

const router = express.Router();

router.use(verifyToken);

router.get("/", getAllAlerts);
router.get("/:id", getAlertById);
router.post("/", createAlert);
router.put("/:id", updateAlert);
router.delete("/:id", deleteAlert);

export default router;
