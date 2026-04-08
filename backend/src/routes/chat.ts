import { Router, Request, Response, NextFunction } from 'express';
import { DataAnalyzer } from '../services/aiHelper';

const router = Router();
const analyzer = new DataAnalyzer(); // single instance for reuse

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  const { question, summaryText } = req.body as {
    question?: string;
    summaryText?: string;
  };

  // Validate inputs
  if (!question?.trim()) {
    return res.status(400).json({ error: 'Question is required' });
  }

  if (!summaryText || typeof summaryText !== 'string' || !summaryText.trim()) {
    return res.status(400).json({ error: 'summaryText is required and must be a string' });
  }

  try {
    // Pass plain text summary and question as a prompt
    const prompt = `Dataset Summary:\n${summaryText}\n\nQuestion: ${question.trim()}\nProvide a concise answer in plain text.`;
    const answer = await analyzer.generateInsights(prompt); // reuse generateInsights for plain text output

    res.json({ answer });
  } catch (err: unknown) {
    console.error('Error generating answer:', err);
    res.status(500).json({ error: 'Failed to generate answer' });
  }
});

export default router;