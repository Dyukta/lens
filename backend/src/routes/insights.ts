import { Router } from 'express'
import { generateInsights } from '../services/aiHelper'
import { DataSummary } from '../types'

const router = Router()

router.post('/', async (req, res) => {
  try {
    const { summary } = req.body as { summary?: DataSummary }

    if (
      !summary ||
      !Array.isArray(summary.columns) ||
      typeof summary.rowCount !== 'number'
    ) {
      return res.status(400).json({ error: 'Invalid summary payload' })
    }

    if (summary.rowCount <= 0) {
      return res.status(400).json({ error: 'Dataset has no rows' })
    }

    const insights = await generateInsights(summary)
    return res.json({ insights })
  } catch (err) {
    console.error('[/insights]', err)
    return res.status(500).json({ error: 'Failed to generate insights' })
  }
})

export default router