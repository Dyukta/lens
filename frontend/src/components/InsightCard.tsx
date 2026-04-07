import type { Insight } from '../types'
import { TrendingUp, AlertTriangle, GitMerge, PieChart, FileText } from 'lucide-react'

const MAP = {
  trend: TrendingUp,
  anomaly: AlertTriangle,
  correlation: GitMerge,
  distribution: PieChart,
  summary: FileText,
}

export default function InsightCard({ insight }: { insight: Insight }) {
  const Icon = MAP[insight.type] || FileText

  return (
    <div className="insight-card">
      <div className="insight-icon">
        <Icon size={14} />
      </div>

      <div>
        <p className="insight-title">{insight.title}</p>
        <p className="insight-desc">{insight.description}</p>
      </div>
    </div>
  )
}