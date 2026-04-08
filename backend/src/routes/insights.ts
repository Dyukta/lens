import { Router, Request, Response, NextFunction } from 'express';
import { DataAnalyzer } from '../services/aiHelper';
import type { DataSummary } from '../types';

const router = Router();
const analyzer = new DataAnalyzer(); // create a single instance

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  const { summary } = req.body as { summary?: DataSummary };

  // Validate request payload
  if (!summary || !Array.isArray(summary.columns) || typeof summary.rowCount !== 'number') {
    return res.status(400).json({ error: 'Invalid summary payload' });
  }

  if (summary.rowCount <= 0) {
    return res.status(400).json({ error: 'Dataset has no rows' });
  }

  try {
    // Generate insights via the class
    const insights = await analyzer.generateInsights(summary);
    res.json({ insights });
  } catch (err: unknown) {
    console.error('Error generating insights:', err);
    res.status(500).json({ error: 'Failed to generate insights' });
  }
});

export default router;