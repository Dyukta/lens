import { Bar, Line, Doughnut, Pie, Scatter } from 'react-chartjs-2'
import type { ChartConfig } from '../../types'
import { BASE_CHART_OPTIONS } from '../../constants/charts'

const MAP = { bar: Bar, line: Line, doughnut: Doughnut, pie: Pie, scatter: Scatter }

export default function ChartPanel({ config }: { config: ChartConfig }) {
  const Comp = MAP[config.type]
  if (!Comp) return null

  return (
    <div className="card">
      <p className="card-title">{config.title}</p>
      <div className="chart-container">
        <Comp data={{ labels: config.labels, datasets: config.datasets }} options={BASE_CHART_OPTIONS} />
      </div>
    </div>
  )
}