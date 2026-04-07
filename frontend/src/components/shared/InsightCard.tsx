import type { Insight, InsightType } from '../../types'

const CONFIG: Record<InsightType, { icon: string; className: string }> = {
  trend:        { icon: '↗', className: 'insight-trend' },
  anomaly:      { icon: '⚠', className: 'insight-anomaly' },
  correlation:  { icon: '⇄', className: 'insight-correlation' },
  distribution: { icon: '◑', className: 'insight-distribution' },
  summary:      { icon: '∑', className: 'insight-summary' },
}

export default function InsightCard({ insight }: { insight: Insight }) {
  const { icon, className } = CONFIG[insight.type]

  return (
    <div className={`card animate-fade-in ${className}`}>
      <div className="flex items-start gap-3">
        <span
          className="mt-0.5 text-base leading-none shrink-0"
          style={{ color: 'var(--insight-color)' }}
        >
          {icon}
        </span>
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