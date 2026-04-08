import fetch from 'node-fetch'; // Remove if using Node 18+ with global fetch
import { DataSummary, Insight, ChatHistoryItem } from '../types';

interface ApiCandidate {
  content: string;
}

interface ApiResponse {
  candidates?: ApiCandidate[];
}

export class DataAnalyzer {
  private apiUrl =
    'https://generativelanguage.googleapis.com/v1beta/models/text-bison-001:generateText';

  // Hardcoded API key
  private apiKey = 'YOUR_HARDCODED_API_KEY_HERE';

  constructor() {
    if (!this.apiKey) {
      throw new Error('API key is required');
    }
  }

  private buildSummaryText(summary: DataSummary): string {
    const lines: string[] = [
      `File: ${summary.fileName}`,
      `Rows: ${summary.rowCount} | Columns: ${summary.columnCount}`,
      '',
      'Column Details:',
    ];

    for (const col of summary.columns) {
      if (col.type === 'numeric') {
        lines.push(
          `• ${col.name} [numeric] — min: ${col.min ?? 'n/a'}, max: ${col.max ?? 'n/a'}, mean: ${
            col.mean !== undefined ? col.mean.toFixed(2) : 'n/a'
          }, nulls: ${col.nullCount}`
        );
      } else if (col.type === 'categorical') {
        lines.push(
          `• ${col.name} [categorical] — ${col.uniqueCount} unique, top: ${
            col.topValues?.join(', ') ?? 'n/a'
          }, nulls: ${col.nullCount}`
        );
      } else if (col.type === 'date') {
        lines.push(`• ${col.name} [date] — ${col.uniqueCount} unique, nulls: ${col.nullCount}`);
      } else {
        lines.push(`• ${col.name} [unknown] — nulls: ${col.nullCount}`);
      }
    }

    return lines.join('\n');
  }

  private async callApi(prompt: string, temperature = 0.3, maxTokens = 300): Promise<string> {
    const body = {
      prompt,
      temperature,
      maxOutputTokens: maxTokens,
    };

    const res = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': this.apiKey,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

    const data = (await res.json()) as ApiResponse;
    return data.candidates?.[0]?.content ?? '';
  }

  async generateInsights(summary: DataSummary): Promise<Insight[]> {
    const prompt = `
Analyze this dataset and return exactly 4-6 insights as a JSON array.
${this.buildSummaryText(summary)}

Return ONLY a JSON array:
[
  { "id": "i1", "title": "...", "description": "...", "type": "trend" }
]
Use types: "trend" | "anomaly" | "correlation" | "distribution" | "summary".
`;

    const raw = await this.callApi(prompt, 0.3, 500);

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      throw new Error('API returned invalid JSON');
    }

    if (!Array.isArray(parsed)) throw new Error('API returned non-array insights');

    return parsed.filter(
      (item: any): item is Insight =>
        typeof item.id === 'string' &&
        typeof item.title === 'string' &&
        typeof item.description === 'string' &&
        ['trend', 'anomaly', 'correlation', 'distribution', 'summary'].includes(item.type)
    );
  }

  async answerQuestion(
    question: string,
    summary: DataSummary,
    history: ChatHistoryItem[]
  ): Promise<string> {
    const system = `
You are a concise data analyst assistant.
Dataset:
${this.buildSummaryText(summary)}

Rules:
- Answer in plain text, no markdown
- Use real column names
- Be specific with numbers
- Max 120 words
`;

    const conversation = [
      { role: 'system', content: system },
      ...history.map((h) => ({ role: h.role, content: h.content })),
      { role: 'user', content: question },
    ];

    const prompt = conversation.map((m) => `${m.role}: ${m.content}`).join('\n\n');

    return (await this.callApi(prompt, 0.4, 300)).trim();
  }
}