import axios from 'axios';
import { GoogleAuth } from 'google-auth-library';
import { DataSummary, Insight, ChatHistoryItem } from '../types';
import 'dotenv/config';


const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText';


function buildSummaryText(summary: DataSummary): string {
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


async function getAccessToken(): Promise<string> {
  const auth = new GoogleAuth({
    keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
  });

  const client = await auth.getClient();
  const token = await client.getAccessToken();
  if (!token?.token) throw new Error('Failed to get access token');
  return token.token;
}


async function callGemini(prompt: string, temperature = 0.3, maxTokens = 300) {
  const accessToken = await getAccessToken();
  const response = await axios.post(
    GEMINI_URL,
    { prompt, temperature, maxOutputTokens: maxTokens },
    { headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' } }
  );

  return response.data?.candidates?.[0]?.content ?? '';
}


export async function generateInsights(summary: DataSummary): Promise<Insight[]> {
  const prompt = `
Analyze this dataset and return exactly 4-6 insights as a JSON array.
${buildSummaryText(summary)}

Return ONLY a JSON array:
[
  { "id": "i1", "title": "...", "description": "...", "type": "trend" }
]
Use types: "trend" | "anomaly" | "correlation" | "distribution" | "summary".
`;

  const raw = await callGemini(prompt, 0.3, 500);

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error('Gemini returned invalid JSON');
  }

  if (!Array.isArray(parsed)) throw new Error('Gemini returned non-array insights');

  return parsed.filter(
    (item: any): item is Insight =>
      typeof item.id === 'string' &&
      typeof item.title === 'string' &&
      typeof item.description === 'string' &&
      ['trend', 'anomaly', 'correlation', 'distribution', 'summary'].includes(item.type)
  );
}


export async function answerQuestion(
  question: string,
  summary: DataSummary,
  history: ChatHistoryItem[]
): Promise<string> {
  const system = `
You are a concise data analyst assistant.
Dataset:
${buildSummaryText(summary)}

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

  return (await callGemini(prompt, 0.4, 300)).trim();
}