"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const monitoredDestinationController_1 = require("../controllers/monitoredDestinationController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.use(auth_1.verifyToken);
router.post("/", monitoredDestinationController_1.createDestination);
router.get("/", monitoredDestinationController_1.getAllDestinations);
router.get("/:id", monitoredDestinationController_1.getDestinationById);
router.put("/:id", monitoredDestinationController_1.updateDestination);
router.delete("/:id", monitoredDestinationController_1.deleteDestination);
exports.default = router;
