import { TrendingUp, AlertTriangle, ArrowLeftRight, PieChart, Hash } from 'lucide-react'
import type { Insight, InsightType } from '../../types'

const CONFIG: Record<InsightType, { icon: React.ElementType; className: string }> = {
  trend:        { icon: TrendingUp,      className: 'insight-trend' },
  anomaly:      { icon: AlertTriangle,   className: 'insight-anomaly' },
  correlation:  { icon: ArrowLeftRight,  className: 'insight-correlation' },
  distribution: { icon: PieChart,        className: 'insight-distribution' },
  summary:      { icon: Hash,            className: 'insight-summary' },
}

export default function InsightCard({ insight }: { insight: Insight }) {
  const { icon: Icon, className } = CONFIG[insight.type]

  return (
    <div className={`card animate-fade-in ${className}`}>
      <div className="flex items-start gap-3">
        <Icon
          size={16}
          className="mt-0.5 shrink-0"
          style={{ color: 'var(--insight-color)' }}
        />
        <div className="min-w-0">
          <p className="text-sm font-semibold leading-snug" style={{ color: 'var(--color-primary)' }}>
            {insight.title}
          </p>
          <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--color-muted)' }}>
            {insight.description}
          </p>
        </div>
      </div>
    </div>
  )
}