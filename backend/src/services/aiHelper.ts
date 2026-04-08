import 'dotenv/config';
import fetch from 'node-fetch';

export class DataAnalyzer {
  private model = 'gemini-3-flash-preview';
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.GENERATIVE_API_KEY || '';
    if (!this.apiKey) throw new Error('GENERATIVE_API_KEY missing');
  }

  private get apiUrl(): string {
    return `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;
  }

  private async callApi(prompt: string, temperature = 0.3, maxTokens = 500): Promise<string> {
    const res = await fetch(this.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature, maxOutputTokens: maxTokens },
      }),
    });

    if (!res.ok) throw new Error(`Gemini ${res.status}: ${await res.text()}`);
    const data: any = await res.json();
    const output = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    if (!output) throw new Error('Empty Gemini response');
    return output;
  }

  async generateInsights(summaryText: string): Promise<string> {
    const prompt = `Data analyst. Give 5 insights from this dataset. Format each as:
TITLE: <title>
TYPE: <trend|anomaly|correlation|distribution|summary>
DESCRIPTION: <one sentence>

Blank line between each. No other text.

${summaryText}`;
    return this.callApi(prompt, 0.3, 800);
  }

  async answerQuestion(
    summaryText: string,
    question: string,
    history: { role: string; content: string }[]
  ): Promise<string> {
    const hist = history.slice(-4)
      .map((m) => `${m.role === 'user' ? 'U' : 'A'}: ${m.content}`)
      .join('\n');

    const prompt = `Data analyst. Plain text only, no markdown. Answer based on data below.
${hist ? `History:\n${hist}\n` : ''}Data: ${summaryText}
Q: ${question.trim()}
A:`;

    return this.callApi(prompt, 0.4, 300);
  }
}