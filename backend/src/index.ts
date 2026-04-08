import dotenv from 'dotenv'
dotenv.config()

import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import insightsRouter from './routes/insights'
import chatRouter from './routes/chat'

const app = express()
const PORT = Number(process.env.PORT) || 5000

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
  : ['http://localhost:5173', 'http://localhost:4173']

app.use(helmet())
app.use(cors({ origin: allowedOrigins }))
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
    hasApiKey: Boolean(process.env.OPENAI_API_KEY),
  })
})


app.get('/', (_req, res) => res.send('Server is alive'))


app.use((_req, res) => res.status(404).json({ error: 'Not found' }))

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[error]', err)
  const message = err instanceof Error ? err.message : 'Internal server error'
  res.status(500).json({ error: message })
})


app.listen(PORT, '0.0.0.0', () => {
  console.log(`Lens backend running on http://localhost:${PORT}`)
})
