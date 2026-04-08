import { Router, Request, Response, NextFunction } from 'express'
import { generateInsights } from '../services/aiHelper'
import type { DataSummary } from '../types'

const router = Router()

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  const { summary } = req.body as { summary?: DataSummary }

  if (!summary || !Array.isArray(summary.columns) || typeof summary.rowCount !== 'number') {
    return res.status(400).json({ error: 'Invalid summary payload' })
  }

  if (summary.rowCount <= 0) {
    return res.status(400).json({ error: 'Dataset has no rows' })
  }

  try {
    const insights = await generateInsights(summary)
    res.json({ insights })
  } catch (err) {
    next(err)
  }
})

export default router