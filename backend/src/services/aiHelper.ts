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

  private async callApi(prompt: string, temperature = 0.3, maxTokens = 500, retries = 2): Promise<string> {
    for (let attempt = 0; attempt <= retries; attempt++) {
      const res = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature, maxOutputTokens: maxTokens },
        }),
      });

      // retry on 503
      if (res.status === 503) {
        if (attempt < retries) {
          await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)));
          continue;
        }
        throw new Error('Gemini is temporarily unavailable. Please try again in a moment.');
      }

      if (!res.ok) throw new Error(`Gemini ${res.status}: ${await res.text()}`);

      const data: any = await res.json();

      // check for blocked/filtered response
      const candidate = data?.candidates?.[0];
      if (!candidate) {
        const reason = data?.promptFeedback?.blockReason;
        throw new Error(reason ? `Request blocked: ${reason}` : 'Empty Gemini response');
      }

      const output = candidate?.content?.parts?.[0]?.text ?? '';
      if (!output) throw new Error('Empty Gemini response');
      return output;
    }

    throw new Error('Gemini unavailable after retries');
  }

  async generateInsights(summaryText: string): Promise<string> {
    const prompt = `Data analyst. Give 4 insights from this dataset. Format each as:
TITLE: <title>
TYPE: <trend|anomaly|correlation|distribution|summary>
DESCRIPTION: <one sentence>

Blank line between each. No other text.

${summaryText}`;
    return this.callApi(prompt, 0.3, 1200);
  }

  async answerQuestion(
    summaryText: string,
    question: string,
    history: { role: string; content: string }[]
  ): Promise<string> {
    const hist = history
      .slice(-4)
      .map((m) => `${m.role === 'user' ? 'U' : 'A'}: ${m.content}`)
      .join('\n');

    const prompt = `Data analyst. Plain text only, no markdown, no intro phrases. Be direct and complete. Max 5 sentences.
${hist ? `History:\n${hist}\n` : ''}Data: ${summaryText}
Q: ${question.trim()}
A:`;

    return this.callApi(prompt, 0.4, 800);
  }
}