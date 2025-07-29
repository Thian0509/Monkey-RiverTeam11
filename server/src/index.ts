import Express from "./express"
const app = new Express().app;

app.get('/api/hello', (_req, res) => {
  console.log('✅ /api/hello called')
  res.json({ message: 'Hello from TypeScript Express backend!' })
})

app.get('/api/db-health', (_req, res) => {
  console.log('✅ /api/db-health called')
  const dbHealthy = true;
  if (dbHealthy) {
    res.status(200).json({ status: 'Database is healthy' });
  } else {
    res.status(500).json({ status: 'Database is down' });
  }
});

const PORT = process.env.PORT || 5050
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`)
})
