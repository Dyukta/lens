import Anthropic from '@anthropic-ai/sdk'
import { DataSummary, Insight, ChatHistoryItem } from '../types'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
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
        `  • ${col.name} [numeric] — min: ${col.min ?? 'n/a'}, max: ${col.max ?? 'n/a'}, mean: ${
          col.mean !== undefined ? col.mean.toFixed(2) : 'n/a'
        }, nulls: ${col.nullCount}`
      )
    } else if (col.type === 'categorical') {
      lines.push(
        `  • ${col.name} [categorical] — ${col.uniqueCount} unique values, top: ${
          col.topValues?.join(', ') ?? 'n/a'
        }, nulls: ${col.nullCount}`
      )
    } else if (col.type === 'date') {
      lines.push(
        `  • ${col.name} [date] — ${col.uniqueCount} unique dates, nulls: ${col.nullCount}`
      )
    } else {
      lines.push(`  • ${col.name} [unknown] — nulls: ${col.nullCount}`)
    }
  }

  return lines.join('\n')
}

function extractText(content: any[]): string {
  return content
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('')
    .trim()
}

export async function generateInsights(summary: DataSummary): Promise<Insight[]> {
  const prompt = `You are a data analyst. Analyze this CSV dataset summary and return exactly 4-6 insights as a JSON array.

Dataset Summary:
${buildSummaryText(summary)}

Return ONLY a valid JSON array. No markdown, no explanation, just the array.
Each object must have:
- id
- title
- description
- type ("trend" | "anomaly" | "correlation" | "distribution" | "summary")`

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    })

    const raw = extractText(response.content).replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(raw)

    return Array.isArray(parsed) ? parsed : []
  } catch {
    return [
      {
        id: 'ins-fallback',
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
  const system = `You are Lens, a data analyst assistant.

Dataset:
${buildSummaryText(summary)}

Rules:
- Be concise
- Use actual column names and values
- Say if unknown
- Keep under 150 words`

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 512,
      system,
      messages: [
        ...history.map((h) => ({
          role: h.role,
          content: h.content,
        })),
        { role: 'user', content: question },
      ],
    })

    return extractText(response.content)
  } catch {
    return 'Failed to generate response. Check backend connection.'
  }
}