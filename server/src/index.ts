import Express from "./express"
const app = new Express().app;

app.get('/api/hello', (_req, res) => {
  console.log('✅ /api/hello called')
  res.json({ message: 'Hello from TypeScript Express backend!' })
})

const PORT = process.env.PORT || 5050
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`)
})
