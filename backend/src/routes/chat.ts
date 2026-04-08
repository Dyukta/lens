import { Router, Request, Response, NextFunction } from 'express';
import { DataAnalyzer } from '../services/aiHelper';
import type { DataSummary, ChatHistoryItem } from '../types';

const router = Router();
const analyzer = new DataAnalyzer(); // single instance for reuse

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  const { question, summary, history } = req.body as {
    question?: string;
    summary?: DataSummary;
    history?: ChatHistoryItem[];
  };

  // Validate inputs
  if (!question?.trim()) {
    return res.status(400).json({ error: 'Question is required' });
  }

  if (!summary || !Array.isArray(summary.columns)) {
    return res.status(400).json({ error: 'Invalid summary payload' });
  }

  try {
    const answer = await analyzer.answerQuestion(
      question.trim(),
      summary,
      Array.isArray(history) ? history : []
    );

    res.json({ answer });
  } catch (err: unknown) {
    console.error('Error answering question:', err);
    res.status(500).json({ error: 'Failed to generate answer' });
  }
});

export default router;