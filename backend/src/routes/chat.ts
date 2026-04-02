import { Router } from 'express'
import { answerQuestion } from '../services/aiHelper'
import { DataSummary, ChatHistoryItem } from '../types'

const router = Router()

router.post('/', async (req, res) => {
  try {
    const { question, summary, history } = req.body as {
      question?: string
      summary?: DataSummary
      history?: ChatHistoryItem[]
    }

    if (typeof question !== 'string' || !question.trim()) {
      return res.status(400).json({ error: 'Question is required' })
    }

    if (!summary || !Array.isArray(summary.columns)) {
      return res.status(400).json({ error: 'Invalid summary payload' })
    }

    const answer = await answerQuestion(
      question.trim(),
      summary,
      Array.isArray(history) ? history : []
    )

    return res.json({ answer })
  } catch (err) {
    console.error('[/chat]', err)
    return res.status(500).json({ error: 'Failed to process question' })
  }
})

export default router