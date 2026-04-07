import axios from 'axios'
import type { DataSummary, Insight, ChatMessage } from '../types'

const api = axios.create({
  baseURL: '/api',
  timeout: 60_000,
  headers: { 'Content-Type': 'application/json' },
})

export async function fetchInsights(summary: DataSummary): Promise<Insight[]> {
  const res = await api.post<{ insights: Insight[] }>('/insights', { summary })
  return res.data.insights
}

export async function sendChatMessage(
  question: string,
  summary: DataSummary,
  history: ChatMessage[]
): Promise<string> {
  const res = await api.post<{ answer: string }>('/chat', {
    question: question.trim(),
    summary,
    history: history.slice(-6).map((m) => ({ role: m.role, content: m.content })),
  })
  return res.data.answer
}