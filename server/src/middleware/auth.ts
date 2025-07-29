// auth.ts (No changes needed, keeping as is)
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

interface DecodedToken {
  userId: string; // This is the key that will be available on req.user
  // Add other properties if your token includes them
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        console.error('JWT_SECRET is not defined in environment variables.');
        return res.status(500).json({ message: 'Server configuration error: JWT secret missing.' });
    }
    const decoded = jwt.verify(token, secret) as DecodedToken;
    (req as any).user = decoded; // Attach user info to request, specifically decoded.userId
    next();
  } catch (error) {
    console.error('JWT verification error:', error);
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Token expired' });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    res.status(500).json({ message: 'Failed to authenticate token.' });
  }
};