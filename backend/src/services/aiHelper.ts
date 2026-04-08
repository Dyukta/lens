import 'dotenv/config';
import fetch from 'node-fetch'; // Node 18+ has fetch globally
import { DataSummary, ChatHistoryItem } from '../types';

export class DataAnalyzer {
  private apiUrl =
    'https://generativelanguage.googleapis.com/v1beta/models/text-bison-001:generateText';
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.GENERATIVE_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('API key is required. Set GENERATIVE_API_KEY in your .env file');
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

    const data: any = await res.json();
    // Return the text content directly without parsing JSON
    return data.candidates?.[0]?.content ?? '';
  }

  async generateInsights(summary: DataSummary): Promise<string> {
    const prompt = `
Analyze this dataset and provide 4-6 insights in plain text.
${this.buildSummaryText(summary)}
Provide a concise and readable output.
`;
    return await this.callApi(prompt, 0.3, 500);
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