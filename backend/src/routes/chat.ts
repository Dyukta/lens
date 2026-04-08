import { Router, Request, Response } from 'express';
import { DataAnalyzer } from '../services/aiHelper';
import type { ChatHistoryItem } from '../types';

const router = Router();
const analyzer = new DataAnalyzer();

router.post('/', async (req: Request, res: Response) => {
  const { question, summaryText, history } = req.body as {
    question?: string;
    summaryText?: string;
    history?: ChatHistoryItem[];
  };

  if (!question?.trim()) {
    return res.status(400).json({ error: 'question is required' });
  }
  if (!summaryText?.trim()) {
    return res.status(400).json({ error: 'summaryText is required' });
  }

  try {
    const answer = await analyzer.answerQuestion(
      summaryText.trim(),
      question.trim(),
      history ?? []
    );
    return res.json({ answer });
  } catch (err) {
    console.error('[chat] error:', err);
    return res.status(500).json({ error: 'Failed to generate answer' });
  }
});

export default router;