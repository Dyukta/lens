/**
 * databridge.ts
 * Single responsibility: transform frontend data structures → API calls → return typed results.
 * All components and hooks should import from here, NOT from api.ts directly.
 */

import { fetchInsights, sendChatMessage } from './api'
import { buildSummaryText } from '../utils/dataSummarizer'
import type { DataSummary, Insight, ChatMessage } from '../types'

// ── Insights ─────────────────────────────────────────────────────────────────

/**
 * Takes a DataSummary object, converts it to a plain text description,
 * and returns structured Insight[] from the backend.
 */
export async function getInsights(summary: DataSummary): Promise<Insight[]> {
  const summaryText = buildSummaryText(summary)
  return fetchInsights(summaryText)
}

// ── Chat ─────────────────────────────────────────────────────────────────────

/**
 * Takes a question, DataSummary, and chat history.
 * Converts summary to text and returns the AI's plain-text answer.
 */
export async function askQuestion(
  question: string,
  summary: DataSummary,
  history: ChatMessage[]
): Promise<string> {
  const summaryText = buildSummaryText(summary)
  return sendChatMessage(question, summaryText, history)
}