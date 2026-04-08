import { Router, Request, Response, NextFunction } from 'express'
import { generateInsights } from '../services/aiHelper'
import type { DataSummary } from '../types'

const router = Router()

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  const { summary } = req.body as { summary?: DataSummary }

  if (!summary || !Array.isArray(summary.columns) || typeof summary.rowCount !== 'number') {
    res.status(400).json({ error: 'Invalid summary payload' })
    return
  }

  if (summary.rowCount <= 0) {
    res.status(400).json({ error: 'Dataset has no rows' })
    return
  }

  try {
    const insights = await generateInsights(summary)
    res.json({ insights })
  } catch (err) {
    next(err)
  }
})

export default router