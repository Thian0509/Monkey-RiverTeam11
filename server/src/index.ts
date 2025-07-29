import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './database'

dotenv.config()
connectDB()

const app = express()
app.use(cors())
app.use(express.json())

app.get('/api/hello', (_req, res) => {
  res.json({ message: 'Hello from TypeScript Express backend!' })
})

import userRoutes from './routes/userRoutes'
import authRoutes from './routes/authRoutes'
app.use('/api/users', userRoutes)
app.use('/api/auth', authRoutes)

import { errorHandler } from './middleware/errorHandler'
app.use(errorHandler)

const PORT = process.env.PORT || 5050
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`)
})
