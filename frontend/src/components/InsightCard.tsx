import type { Insight } from '../types'
import {
  TrendingUp,
  AlertTriangle,
  GitMerge,
  PieChart,
  FileText,
} from 'lucide-react'

const ICONS = {
  trend: TrendingUp,
  anomaly: AlertTriangle,
  correlation: GitMerge,
  distribution: PieChart,
  summary: FileText,
} as const

const COLORS = {
  trend: {
    border: 'rgba(92,252,168,0.25)',
    dot: '#5cfca8',
    bg: 'rgba(92,252,168,0.08)',
  },
  anomaly: {
    border: 'rgba(252,92,92,0.25)',
    dot: '#fc5c5c',
    bg: 'rgba(252,92,92,0.08)',
  },
  correlation: {
    border: 'rgba(92,140,252,0.25)',
    dot: '#5c8cfc',
    bg: 'rgba(92,140,252,0.08)',
  },
  distribution: {
    border: 'rgba(124,92,252,0.25)',
    dot: '#7c5cfc',
    bg: 'rgba(124,92,252,0.08)',
  },
  summary: {
    border: 'rgba(252,192,92,0.25)',
    dot: '#fcc05c',
    bg: 'rgba(252,192,92,0.08)',
  },
} as const

export default function InsightCard({ insight }: { insight: Insight }) {
  const Icon = ICONS[insight.type] ?? FileText
  const color = COLORS[insight.type] ?? COLORS.summary

  return (
    <div
      className="rounded-xl p-4 border transition-colors animate-slide-up"
      style={{
        borderColor: color.border,
        backgroundColor: color.bg,
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
          style={{ backgroundColor: `${color.dot}20` }}
        >
          <Icon className="w-3.5 h-3.5" style={{ color: color.dot }} />
        </div>

        <div>
          <p className="text-text-primary text-sm font-medium">
            {insight.title}
          </p>
          <p className="text-text-secondary text-xs mt-1 leading-relaxed">
            {insight.description}
          </p>
        </div>
      </div>
    </div>
  )
}