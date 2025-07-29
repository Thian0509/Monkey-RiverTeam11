// server/routes/account.ts
import express from 'express';
import User from '../models/User'; // adjust path if different
import { verifyToken } from '../middleware/auth';

const router = express.Router();

router.get('/me', verifyToken, async (req, res) => {
  const userId = (req as any).user.userId;

  try {
    const user = await User.findById(userId).select('-passwordHash');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
