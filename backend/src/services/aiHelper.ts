import 'dotenv/config';
import fetch from 'node-fetch';

export class DataAnalyzer {
  private apiUrl =
    'https://generativelanguage.googleapis.com/v1beta/models/text-bison-001:generateText';
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.GENERATIVE_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('GENERATIVE_API_KEY is missing from .env');
    }
  }

  private async callApi(promptText: string, temperature = 0.3, maxTokens = 600): Promise<string> {
    const body = {
      prompt: { text: promptText }, // ✅ correct text-bison format
      temperature,
      maxOutputTokens: maxTokens,
    };

    const res = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`API error ${res.status}: ${errText}`);
    }

    const data: any = await res.json();
    const output = data?.candidates?.[0]?.output ?? '';
    if (!output) throw new Error('Empty response from AI API');
    return output;
  }

  async generateInsights(summaryText: string): Promise<string> {
    const prompt = `
You are a data analyst. Analyze the dataset below and return exactly 4 insights.

Each insight MUST follow this exact format (no deviation):
TITLE: <short title>
TYPE: <one of: trend, anomaly, correlation, distribution, summary>
DESCRIPTION: <one sentence description>

Separate each insight with a blank line.

Dataset Summary:
${summaryText}
`.trim();

    return this.callApi(prompt, 0.3, 600);
  }

  async answerQuestion(
    summaryText: string,
    question: string,
    history: { role: string; content: string }[]
  ): Promise<string> {
    const historyText = history
      .slice(-6)
      .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
      .join('\n');

    const prompt = `
You are a data analyst assistant. Answer the user's question based only on the dataset summary below.
Be concise and factual.

Dataset Summary:
${summaryText}

${historyText ? `Conversation so far:\n${historyText}\n` : ''}
User: ${question.trim()}
Assistant:
`.trim();

    return this.callApi(prompt, 0.4, 400);
  }
}