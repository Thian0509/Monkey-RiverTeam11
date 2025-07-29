import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'; // Make sure this is imported

dotenv.config(); // Make sure this is called early in this file or index.ts

interface DecodedToken {
  userId: string;
  // Add other properties if your token includes them
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
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
    const decoded = jwt.verify(token, secret) as DecodedToken;
    (req as any).user = decoded; // Attach user info to request
    next();
  } catch (error) {
    console.error('JWT verification error:', error); // Log the actual error
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Token expired' });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    res.status(500).json({ message: 'Failed to authenticate token.' });
  }
};