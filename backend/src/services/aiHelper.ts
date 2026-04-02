import OpenAI from 'openai'
import { DataSummary, Insight, ChatHistoryItem } from '../types'

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

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
      lines.push(
        `• ${col.name} [date] — ${col.uniqueCount} unique, nulls: ${col.nullCount}`
      )
    } else {
      lines.push(`• ${col.name} [unknown] — nulls: ${col.nullCount}`)
    }
  }

  return lines.join('\n')
}

export async function generateInsights(summary: DataSummary): Promise<Insight[]> {
  const prompt = `
Analyze this dataset and return 4-6 insights.

${buildSummaryText(summary)}

Return ONLY JSON array:
[
 { id, title, description, type }
]

type must be one of:
"trend" | "anomaly" | "correlation" | "distribution" | "summary"
`

  try {
    const res = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
    })

    const raw = res.choices[0]?.message?.content || '[]'

    const parsed = JSON.parse(raw)

    return Array.isArray(parsed) ? parsed : []
  } catch {
    return [
      {
        id: 'fallback',
        title: 'Dataset loaded',
        description: `${summary.rowCount} rows and ${summary.columnCount} columns detected.`,
        type: 'summary',
      },
    ]
  }
}

export async function answerQuestion(
  question: string,
  summary: DataSummary,
  history: ChatHistoryItem[]
): Promise<string> {
  const system = `
You are a data analyst.

Dataset:
${buildSummaryText(summary)}

Rules:
- Be concise
- Use real column names
- Max 120 words
`

  try {
    const res = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: system },
        ...history.map((h) => ({
          role: h.role,
          content: h.content,
        })),
        { role: 'user', content: question },
      ],
      temperature: 0.4,
    })

    return res.choices[0]?.message?.content || 'No response'
  } catch {
    return 'Failed to generate response.'
  }
}