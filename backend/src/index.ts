import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import rateLimit from 'express-rate-limit'
import insightsRouter from './routes/insights'
import chatRouter from './routes/chat'

dotenv.config()

const app = express()
const PORT = Number(process.env.PORT) || 3001

app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:4173'],
  })
)

app.use(express.json({ limit: '2mb' }))

const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: { error: 'Too many requests, slow down.' },
  standardHeaders: true,
  legacyHeaders: false,
})

app.use('/api/insights', aiLimiter, insightsRouter)
app.use('/api/chat', aiLimiter, chatRouter)

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    hasApiKey: Boolean(process.env.ANTHROPIC_API_KEY),
  })
})

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' })
})

app.listen(PORT, () => {
  console.log(`Lens backend running on http://localhost:${PORT}`)
})