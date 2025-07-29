import express from 'express'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())

app.get('/api/hello', (_req, res) => {
  console.log('✅ /api/hello called')
  res.json({ message: 'Hello from TypeScript Express backend!' })
})

const PORT = process.env.PORT || 5050
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`)
})
