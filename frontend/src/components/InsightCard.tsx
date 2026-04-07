import type { Insight } from '../types'
import { TrendingUp, AlertTriangle, GitMerge, PieChart, FileText } from 'lucide-react'

const CONFIG = {
  trend: {
    icon: TrendingUp,
    border: 'rgba(92,252,168,0.2)',
    dot: '#5cfca8',
    bg: 'rgba(92,252,168,0.06)',
    label: 'TREND',
    labelColor: '#5cfca8',
  },
  anomaly: {
    icon: AlertTriangle,
    border: 'rgba(252,92,92,0.2)',
    dot: '#fc5c5c',
    bg: 'rgba(252,92,92,0.06)',
    label: 'ANOMALY',
    labelColor: '#fc5c5c',
  },
  correlation: {
    icon: GitMerge,
    border: 'rgba(92,140,252,0.2)',
    dot: '#5c8cfc',
    bg: 'rgba(92,140,252,0.06)',
    label: 'CORRELATION',
    labelColor: '#5c8cfc',
  },
  distribution: {
    icon: PieChart,
    border: 'rgba(124,92,252,0.2)',
    dot: '#7c5cfc',
    bg: 'rgba(124,92,252,0.06)',
    label: 'DISTRIBUTION',
    labelColor: '#7c5cfc',
  },
  summary: {
    icon: FileText,
    border: 'rgba(252,192,92,0.2)',
    dot: '#fcc05c',
    bg: 'rgba(252,192,92,0.06)',
    label: 'SUMMARY',
    labelColor: '#fcc05c',
  },
} as const

export default function InsightCard({ insight }: { insight: Insight }) {
  const cfg = CONFIG[insight.type] ?? CONFIG.summary
  const Icon = cfg.icon

  return (
    <div style={{
      border: `1px solid ${cfg.border}`,
      background: cfg.bg,
      borderRadius: 14,
      padding: '14px 16px',
      display: 'flex',
      gap: 12,
      alignItems: 'flex-start',
      transition: 'border-color 0.2s',
    }}>
      <div style={{
        width: 32,
        height: 32,
        borderRadius: 10,
        background: `${cfg.dot}18`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        marginTop: 1,
      }}>
        <Icon style={{ width: 15, height: 15, color: cfg.dot }} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: '0.08em',
            color: cfg.labelColor,
            fontFamily: 'JetBrains Mono, monospace',
            background: `${cfg.dot}15`,
            padding: '2px 6px',
            borderRadius: 4,
          }}>
            {cfg.label}
          </span>
        </div>
        <p style={{
          color: '#e8e8f0',
          fontSize: 13,
          fontWeight: 600,
          lineHeight: 1.4,
          marginBottom: 4,
        }}>
          {insight.title}
        </p>
        <p style={{
          color: '#6666888',
          fontSize: 12,
          lineHeight: 1.6,
        }}>
          {insight.description}
        </p>
      </div>
    </div>
  )
}