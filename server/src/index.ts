import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './database'
import Express from "./express"



dotenv.config()
connectDB()

const app = new Express().app;

app.get('/api/db-health', (_req, res) => {
  console.log('✅ /api/db-health called')
  const dbHealthy = true;
  if (dbHealthy) {
    res.status(200).json({ status: 'Database is healthy' });
  } else {
    res.status(500).json({ status: 'Database is down' });
  }
});

app.use('/api/users', require('./routes/users'));

import userRoutes from './routes/userRoutes'
import authRoutes from './routes/authRoutes'
app.use('/api/users', userRoutes)
app.use('/api/auth', authRoutes)

import { errorHandler } from './middleware/errorHandler'
app.use(errorHandler)

const PORT = process.env.PORT || 5050
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
