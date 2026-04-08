import { useEffect, useRef, useState } from 'react'
import { useAppStore } from '../../store/useAppStore'
import { formatNumber } from '../../utils/dataSummarizer'

function useCountUp(target: number, duration = 600) {
  const [value, setValue] = useState(0)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    let current = 0
    const steps = 20
    const increment = Math.ceil(target / steps)

    const tick = () => {
      current += increment
      if (current >= target) {
        setValue(target)
        return
      }
      setValue(current)
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [target, duration])

  return value
}

interface StatCardProps {
  label: string
  value: string
}

function StatCard({ label, value }: StatCardProps) {
  const isInteger = /^\d+$/.test(value)
  const counted = useCountUp(isInteger ? parseInt(value, 10) : 0)

  return (
    <div className="stat-card">
      <p className="stat-label">{label}</p>
      <p className="stat-value">{isInteger ? counted : value}</p>
    </div>
  )
}

export default function SummaryStrip() {
  const summary = useAppStore((s) => s.parsedCSV?.summary)

  if (!summary) return null

  const numericCols = summary.columns.filter((c) => c.type === 'numeric')
  const categoricalCols = summary.columns.filter((c) => c.type === 'categorical')
  const dateCols = summary.columns.filter((c) => c.type === 'date')

  const kpiCol = numericCols.find((c) =>
    /total|revenue|amount|sales|price|value|spend/i.test(c.name)
  )

  const stats = [
    { label: 'Rows',        value: summary.rowCount.toString() },
    { label: 'Columns',     value: summary.columnCount.toString() },
    { label: 'Numeric',     value: numericCols.length.toString() },
    { label: 'Categorical', value: categoricalCols.length.toString() },
    { label: 'Date',        value: dateCols.length.toString() },
    ...(kpiCol?.mean != null
      ? [{ label: `Avg ${kpiCol.name}`, value: formatNumber(kpiCol.mean) }]
      : []),
    ...(kpiCol?.max != null
      ? [{ label: `Max ${kpiCol.name}`, value: formatNumber(kpiCol.max) }]
      : []),
  ]

  return (
    <div
      className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 px-5 py-4 border-b"
      style={{ borderColor: 'var(--color-border)' }}
    >
      {stats.map((s) => (
        <StatCard key={s.label} label={s.label} value={s.value} />
      ))}
    </div>
  )
}