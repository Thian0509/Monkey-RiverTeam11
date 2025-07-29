"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userController_1 = __importDefault(require("../controllers/userController"));
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.get("/", userController_1.default.getAllUsers);
router.get("/:id", userController_1.default.getUserById);
router.post("/", userController_1.default.createUser);
router.put("/:id", userController_1.default.updateUser);
router.delete("/:id", userController_1.default.deleteUser);
exports.default = router;
