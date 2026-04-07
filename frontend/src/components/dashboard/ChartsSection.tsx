import { useAppStore } from '../../store/useAppStore'
import { useChartConfig } from '../../hooks/useChartConfig'
import ChartPanel from '../shared/ChartPanel'

export default function ChartsSection() {
  const parsedCSV = useAppStore((s) => s.parsedCSV)
  const charts = useChartConfig(parsedCSV)

  if (!charts.length) return (
    <p className="text-sm px-1" style={{ color: 'var(--color-muted)' }}>
      No charts could be generated from this data.
    </p>
  )

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      {charts.map((config, i) => (
        <ChartPanel key={`${config.type}-${i}`} config={config} />
      ))}
    </div>
  )
}