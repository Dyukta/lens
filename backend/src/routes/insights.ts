import { Router, Request, Response } from 'express';
import { DataAnalyzer } from '../services/aiHelper';

const router = Router();
const analyzer = new DataAnalyzer();

router.post('/', async (req: Request, res: Response) => {
  const { summaryText } = req.body as { summaryText?: string };

  if (!summaryText?.trim()) {
    return res.status(400).json({ error: 'summaryText is required' });
  }

  try {
    const raw = await analyzer.generateInsights(summaryText.trim());

    const insights = parseInsights(raw);
    return res.json({ insights });
  } catch (err) {
    console.error('[insights] error:', err);
    return res.status(500).json({ error: 'Failed to generate insights' });
  }
});

function parseInsights(raw: string) {
  const blocks = raw.trim().split(/\n\s*\n/); 
  const validTypes = ['trend', 'anomaly', 'correlation', 'distribution', 'summary'];

  return blocks
    .map((block, i) => {
      const titleMatch = block.match(/TITLE:\s*(.+)/i);
      const typeMatch = block.match(/TYPE:\s*(.+)/i);
      const descMatch = block.match(/DESCRIPTION:\s*(.+)/i);

      const type = typeMatch?.[1]?.trim().toLowerCase() ?? 'summary';

      return {
        id: `insight-${Date.now()}-${i}`,
        title: titleMatch?.[1]?.trim() ?? `Insight ${i + 1}`,
        type: validTypes.includes(type) ? type : 'summary',
        description: descMatch?.[1]?.trim() ?? block.trim(),
      };
    })
    .filter((ins) => ins.description.length > 0);
}

export default router;