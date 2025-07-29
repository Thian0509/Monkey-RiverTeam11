import User from "../models/User";
import { Request, Response } from "express";
import bcrypt from "bcrypt";

export default {
  getAllUsers: async (req: Request, res: Response) => {
    try {
      const users = await User.find();
      res
        .status(200)
        .json({ message: "All users fetched successfully", users });
    } catch (error: any) {
      console.error("Error fetching users:", error);
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },
  getUserById: async (req: Request, res: Response) => {
    const userId = req.params.id;
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res
        .status(200)
        .json({ message: `User with ID ${userId} fetched successfully`, user });
    } catch (error: any) {
      console.error("Error fetching user:", error);
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },
  createUser: async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    try {
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = await User.create({ name, email, passwordHash });

      res
        .status(201)
        .json({ message: "User created successfully", user: newUser });
    } catch (error: any) {
      console.error("Error creating user:", error);
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },
  updateUser: async (req: Request, res: Response) => {
    const userId = req.params.id;
    const updatedData = req.body;
    try {
      const user = await User.findByIdAndUpdate(userId, updatedData, {
        new: true,
        runValidators: true,
      });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res
        .status(200)
        .json({ message: `User with ID ${userId} updated successfully`, user });
    } catch (error: any) {
      console.error("Error updating user:", error);
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },
  deleteUser: async (req: Request, res: Response) => {
    const userId = req.params.id;
    try {
      const result = await User.findByIdAndDelete(userId);
      if (!result) {
        return res.status(404).json({ message: "User not found" });
      }
      res
        .status(200)
        .json({ message: `User with ID ${userId} deleted successfully` });
    } catch (error: any) {
      console.error("Error deleting user:", error);
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },
};
