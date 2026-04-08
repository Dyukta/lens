import { Router, Request, Response, NextFunction } from 'express'
import { answerQuestion } from '../services/aiHelper'
import type { DataSummary, ChatHistoryItem } from '../types'

const router = Router()

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  const { question, summary, history } = req.body as {
    question?: string
    summary?: DataSummary
    history?: ChatHistoryItem[]
  }

  if (typeof question !== 'string' || !question.trim()) {
    res.status(400).json({ error: 'Question is required' })
    return
  }

  if (!summary || !Array.isArray(summary.columns)) {
    res.status(400).json({ error: 'Invalid summary payload' })
    return
  }

  try {
    const answer = await answerQuestion(
      question.trim(),
      summary,
      Array.isArray(history) ? history : []
    )
    res.json({ answer })
  } catch (err) {
    next(err)
  }
})

export default router