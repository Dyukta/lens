import 'dotenv/config';
import fetch from 'node-fetch';

export class DataAnalyzer {
  private model = 'gemini-2.0-flash'; // ✅ valid model name
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.GENERATIVE_API_KEY || '';
    console.log('API key loaded:', this.apiKey ? '✅ found' : '❌ missing');
    if (!this.apiKey) {
      throw new Error('GENERATIVE_API_KEY is missing from .env');
    }
  }

  private get apiUrl(): string {
    return `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;
  }

  private async callApi(promptText: string, temperature = 0.3, maxTokens = 600): Promise<string> {
    const body = {
      contents: [
        {
          parts: [{ text: promptText }], // ✅ correct Gemini format
        },
      ],
      generationConfig: {
        temperature,
        maxOutputTokens: maxTokens, // ✅ must be inside generationConfig
      },
    };

    console.log('Calling Gemini API:', this.model);

    const res = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': this.apiKey, // ✅ key in header AND url for safety
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Gemini API error ${res.status}: ${errText}`);
    }

    const data: any = await res.json();
    const output = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''; // ✅ correct Gemini response path
    if (!output) throw new Error('Empty response from Gemini API');
    return output;
  }

  async generateInsights(summaryText: string): Promise<string> {
    const prompt = `
You are a data analyst. Analyze the dataset below and return exactly 4 insights.

Each insight MUST follow this exact format:
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