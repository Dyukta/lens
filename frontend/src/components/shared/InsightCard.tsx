import type { Insight } from '../../types'

export default function InsightCard({ insight }: { insight: Insight }) {
  return (
    <div className="card">
      <p className="font-medium">{insight.title}</p>
      <p className="text-sm text-muted">{insight.description}</p>
    </div>
  )
}