"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv")); // Make sure this is imported
dotenv_1.default.config(); // Make sure this is called early in this file or index.ts
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    try {
        const secret = process.env.JWT_SECRET; // This should be the same as in .env
        if (!secret) {
            console.error('JWT_SECRET is not defined in environment variables.');
            return res.status(500).json({ message: 'Server configuration error: JWT secret missing.' });
        }
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        req.user = decoded; // Attach user info to request
        next();
    }
    catch (error) {
        console.error('JWT verification error:', error); // Log the actual error
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            return res.status(401).json({ message: 'Token expired' });
        }
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        res.status(500).json({ message: 'Failed to authenticate token.' });
    }
};
exports.verifyToken = verifyToken;
