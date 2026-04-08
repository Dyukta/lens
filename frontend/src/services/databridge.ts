import { fetchInsights, sendChatMessage } from './api'
import { buildSummaryText } from '../utils/dataSummarizer'
import type { DataSummary, Insight, ChatMessage } from '../types'

export async function getInsights(summary: DataSummary): Promise<Insight[]> {
  const summaryText = buildSummaryText(summary)
  return fetchInsights(summaryText)
}

export async function askQuestion(
  question: string,
  summary: DataSummary,
  history: ChatMessage[]
): Promise<string> {
  const summaryText = buildSummaryText(summary)
  return sendChatMessage(question, summaryText, history)
}