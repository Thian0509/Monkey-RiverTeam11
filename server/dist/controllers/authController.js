"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = exports.loginUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_1 = __importDefault(require("../models/User"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const expiresIn = process.env.JWT_EXPIRES || "1h";
const loginUser = async (req, res) => {
    console.log("Login attempt with body:", req.body);
    const { email, password } = req.body;
    const user = await User_1.default.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    const valid = await bcrypt_1.default.compare(password, user.passwordHash);
    if (!valid) {
        return res.status(401).json({ message: "Invalid credentials" });
    }
    const payload = { userId: user._id };
    const secret = process.env.JWT_SECRET;
    const options = { expiresIn };
    const token = jsonwebtoken_1.default.sign(payload, secret, options);
    res.json({ token });
};
exports.loginUser = loginUser;
const registerUser = async (req, res) => {
    console.log("Registration attempt with body:", req.body);
    const { name, email, password } = req.body;
    const existing = await User_1.default.findOne({ email });
    if (existing) {
        return res.status(400).json({ message: "Email already exists" });
    }
    const passwordHash = await bcrypt_1.default.hash(password, 10);
    const newUser = await User_1.default.create({ name, email, passwordHash });
    const payload = { userId: newUser._id };
    const secret = process.env.JWT_SECRET;
    const options = { expiresIn };
    const token = jsonwebtoken_1.default.sign(payload, secret, options);
    res.status(201).json({ token });
};
exports.registerUser = registerUser;
