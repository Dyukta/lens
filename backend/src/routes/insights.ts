import { Router, Request, Response, NextFunction } from 'express';
import { DataAnalyzer } from '../services/aiHelper';

const router = Router();
const analyzer = new DataAnalyzer(); // single instance

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  const { summaryText } = req.body as { summaryText?: string };

  // Validate request payload
  if (!summaryText || typeof summaryText !== 'string' || !summaryText.trim()) {
    return res.status(400).json({ error: 'summaryText is required and must be a string' });
  }

  try {
    // Generate insights via the class
    const insights = await analyzer.generateInsights(summaryText.trim());
    res.json({ insights }); // plain text
  } catch (err: unknown) {
    console.error('Error generating insights:', err);
    res.status(500).json({ error: 'Failed to generate insights' });
  }
});

export default router;