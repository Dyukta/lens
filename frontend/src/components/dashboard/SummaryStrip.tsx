import { useAppStore } from '../../store/useAppStore'
import { formatNumber } from '../../utils/dataSummarizer'

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
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 px-5 py-4 border-b"
      style={{ borderColor: 'var(--color-border)' }}>
      {stats.map((s) => (
        <div key={s.label} className="stat-card">
          <p className="stat-label">{s.label}</p>
          <p className="stat-value">{s.value}</p>
        </div>
      ))}
    </div>
  )
}