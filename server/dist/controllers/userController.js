"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../models/User"));
const bcrypt_1 = __importDefault(require("bcrypt"));
exports.default = {
    getAllUsers: async (req, res) => {
        try {
            const users = await User_1.default.find();
            res
                .status(200)
                .json({ message: "All users fetched successfully", users });
        }
        catch (error) {
            console.error("Error fetching users:", error);
            res
                .status(500)
                .json({ message: "Internal server error", error: error.message });
        }
    },
    getUserById: async (req, res) => {
        const userId = req.params.id;
        try {
            const user = await User_1.default.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            res
                .status(200)
                .json({ message: `User with ID ${userId} fetched successfully`, user });
        }
        catch (error) {
            console.error("Error fetching user:", error);
            res
                .status(500)
                .json({ message: "Internal server error", error: error.message });
        }
    },
    createUser: async (req, res) => {
        const { name, email, password } = req.body;
        try {
            const existing = await User_1.default.findOne({ email });
            if (existing) {
                return res.status(400).json({ message: "Email already exists" });
            }
            const passwordHash = await bcrypt_1.default.hash(password, 10);
            const newUser = await User_1.default.create({ name, email, passwordHash });
            res
                .status(201)
                .json({ message: "User created successfully", user: newUser });
        }
        catch (error) {
            console.error("Error creating user:", error);
            res
                .status(500)
                .json({ message: "Internal server error", error: error.message });
        }
    },
    updateUser: async (req, res) => {
        const userId = req.params.id;
        const updatedData = req.body;
        try {
            const user = await User_1.default.findByIdAndUpdate(userId, updatedData, {
                new: true,
                runValidators: true,
            });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            res
                .status(200)
                .json({ message: `User with ID ${userId} updated successfully`, user });
        }
        catch (error) {
            console.error("Error updating user:", error);
            res
                .status(500)
                .json({ message: "Internal server error", error: error.message });
        }
    },
    deleteUser: async (req, res) => {
        const userId = req.params.id;
        try {
            const result = await User_1.default.findByIdAndDelete(userId);
            if (!result) {
                return res.status(404).json({ message: "User not found" });
            }
            res
                .status(200)
                .json({ message: `User with ID ${userId} deleted successfully` });
        }
        catch (error) {
            console.error("Error deleting user:", error);
            res
                .status(500)
                .json({ message: "Internal server error", error: error.message });
        }
    },
};
