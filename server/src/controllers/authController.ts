import jwt, { SignOptions } from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User";
import { Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const expiresIn: SignOptions["expiresIn"] = (process.env.JWT_EXPIRES as SignOptions["expiresIn"]) || "1h";
export const loginUser = async (req: Request, res: Response) => {
  console.log("Login attempt with body:", req.body);

  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);

  if (!valid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const payload = { userId: user._id };
  const secret = process.env.JWT_SECRET as string;
  const options: SignOptions = { expiresIn };
  const token = jwt.sign(payload, secret, options);
  res.json({ token });
};

export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const existing = await User.findOne({ email });

  if (existing) {
    return res.status(400).json({ message: "Email already exists" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = await User.create({ name, email, passwordHash });
  const payload = { userId: newUser._id };
  const secret = process.env.JWT_SECRET as string;
  const options: SignOptions = { expiresIn };
  const token = jwt.sign(payload, secret, options);
  res.status(201).json({ token });
};
