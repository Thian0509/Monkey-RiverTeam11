"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const alertController_1 = require("../controllers/alertController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.use(auth_1.verifyToken);
router.get("/", alertController_1.getAllAlerts);
router.get("/:id", alertController_1.getAlertById);
router.post("/", alertController_1.createAlert);
router.put("/:id", alertController_1.updateAlert);
router.delete("/:id", alertController_1.deleteAlert);
exports.default = router;
