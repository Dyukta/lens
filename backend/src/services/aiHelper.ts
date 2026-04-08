import OpenAI from 'openai'
import type { DataSummary, Insight, ChatHistoryItem } from '../types'

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const MODEL = 'gpt-4o-mini'

function buildSummaryText(summary: DataSummary): string {
  const lines: string[] = [
    `File: ${summary.fileName}`,
    `Rows: ${summary.rowCount} | Columns: ${summary.columnCount}`,
    '',
    'Column Details:',
  ]

  for (const col of summary.columns) {
    if (col.type === 'numeric') {
      lines.push(
        `• ${col.name} [numeric] — min: ${col.min ?? 'n/a'}, max: ${col.max ?? 'n/a'}, mean: ${
          col.mean !== undefined ? col.mean.toFixed(2) : 'n/a'
        }, nulls: ${col.nullCount}`
      )
    } else if (col.type === 'categorical') {
      lines.push(
        `• ${col.name} [categorical] — ${col.uniqueCount} unique, top: ${
          col.topValues?.join(', ') ?? 'n/a'
        }, nulls: ${col.nullCount}`
      )
    } else if (col.type === 'date') {
      lines.push(`• ${col.name} [date] — ${col.uniqueCount} unique, nulls: ${col.nullCount}`)
    } else {
      lines.push(`• ${col.name} [unknown] — nulls: ${col.nullCount}`)
    }
  }

  return lines.join('\n')
}

function extractJSON(raw: string): unknown {
  const fenceMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/)
  const text = fenceMatch ? fenceMatch[1].trim() : raw.trim()
  return JSON.parse(text)
}

export async function generateInsights(summary: DataSummary): Promise<Insight[]> {
  const prompt = `Analyze this dataset and return exactly 4-6 insights as a JSON array.

${buildSummaryText(summary)}

Return ONLY a raw JSON array with no markdown, no explanation, no code fences:
[
  { "id": "i1", "title": "...", "description": "...", "type": "trend" }
]

type must be one of: "trend" | "anomaly" | "correlation" | "distribution" | "summary"
Each description should be one concise sentence with a specific number or observation.`

  const res = await client.chat.completions.create({
    model: MODEL,
    temperature: 0.3,
    messages: [{ role: 'user', content: prompt }],
  })

  const raw = res.choices[0]?.message?.content ?? '[]'
  const parsed = extractJSON(raw)

  if (!Array.isArray(parsed)) {
    throw new Error('Model returned non-array insights response')
  }

  const valid = parsed.filter(
    (item): item is Insight =>
      typeof item === 'object' &&
      item !== null &&
      typeof item.id === 'string' &&
      typeof item.title === 'string' &&
      typeof item.description === 'string' &&
      ['trend', 'anomaly', 'correlation', 'distribution', 'summary'].includes(item.type)
  )

  if (valid.length === 0) {
    throw new Error('Model returned no valid insight objects')
  }

  return valid
}

export async function answerQuestion(
  question: string,
  summary: DataSummary,
  history: ChatHistoryItem[]
): Promise<string> {
  const system = `You are a concise data analyst assistant.

Dataset:
${buildSummaryText(summary)}

Rules:
- Answer in plain text, no markdown
- Use real column names from the dataset
- Be specific with numbers when relevant
- Maximum 120 words`

  const res = await client.chat.completions.create({
    model: MODEL,
    temperature: 0.4,
    messages: [
      { role: 'system', content: system },
      ...history.map((h) => ({ role: h.role, content: h.content })),
      { role: 'user', content: question },
    ],
  })

  const text = res.choices[0]?.message?.content

  if (!text) {
    throw new Error('Model returned empty response')
  }

  return text.trim()
}