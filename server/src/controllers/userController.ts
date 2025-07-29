import { Request, Response } from 'express';
import { get } from 'http';
// const User = require('../models/User'); // will import this later...

export default {
  getAllUsers: async (req: Request, res: Response) => {
    try {
      // Fetch all users from the database
      // const users = await User.find();
      res.status(200).json({ message: 'All users fetched successfully' });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  getUserById: async (req: Request, res: Response) => {
    const userId = req.params.id;
    try {
      // Fetch user by ID from the database
      // const user = await User.findById(userId);
      res.status(200).json({ message: `User with ID ${userId} fetched successfully` });
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  createUser: async (req: Request, res: Response) => {
    const newUser = req.body;
    try {
      // Create a new user in the database
      // const user = await User.create(newUser);
      res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  updateUser: async (req: Request, res: Response) => {
    const userId = req.params.id;
    const updatedData = req.body;
    try {
      // Update user in the database
      // const user = await User.findByIdAndUpdate(userId, updatedData, { new: true });
      res.status(200).json({ message: `User with ID ${userId} updated successfully`, user: updatedData });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  deleteUser: async (req: Request, res: Response) => {
    const userId = req.params.id;
    try {
      // Delete a user from the database
      // await User.findByIdAndDelete(userId);
      res.status(200).json({ message: `User with ID ${userId} deleted successfully` });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
}
