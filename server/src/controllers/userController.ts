import User from '../models/User'
import { Request, Response } from 'express'
import bcrypt from 'bcrypt'

export const createUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body
  const existing = await User.findOne({ email })
  if (existing) return res.status(400).json({ message: 'Email already exists' })

  const passwordHash = await bcrypt.hash(password, 10)
  const newUser = await User.create({ name, email, passwordHash })

  res.status(201).json(newUser)
}