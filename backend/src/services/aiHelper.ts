import 'dotenv/config';
import fetch from 'node-fetch'; // Node 18+ has fetch globally
import { DataSummary } from '../types';

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
    return data.candidates?.[0]?.content ?? '';
  }

  async generateInsights(summaryText: string): Promise<string> {
    const prompt = `
Analyze this dataset and provide 4-6 insights in plain text.
${summaryText}
Provide a concise and readable output.
`;
    return await this.callApi(prompt, 0.3, 500);
  }
}