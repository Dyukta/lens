import axios from 'axios'
import type { Insight, ChatMessage } from '../types'

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 60_000,
  headers: { 'Content-Type': 'application/json' },
})


export async function fetchInsights(summaryText: string): Promise<Insight[]> {
  const res = await api.post<{ insights: Insight[] }>('/insights', { summaryText })
  return res.data.insights
}

export async function sendChatMessage(
  question: string,
  summaryText: string,
  history: ChatMessage[]
): Promise<string> {
  const res = await api.post<{ answer: string }>('/chat', {
    question: question.trim(),
    summaryText,
    history: history.slice(-6).map((m) => ({ role: m.role, content: m.content })),
  })
  return res.data.answer
}