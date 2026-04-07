import React from 'react'
import { Bar, Line, Doughnut, Pie, Scatter } from 'react-chartjs-2'
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  PointElement, LineElement, ArcElement, Tooltip, Legend,
  BarController, LineController, DoughnutController, PieController, ScatterController
} from 'chart.js'
import type { ChartConfig } from '../../types'
import { BASE_CHART_OPTIONS } from '../../constants/charts'

ChartJS.register(
  CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement,
  Tooltip, Legend, BarController, LineController, DoughnutController, PieController, ScatterController,
)

const CHART_MAP = {
  bar: Bar, line: Line, doughnut: Doughnut, pie: Pie, scatter: Scatter,
} as const

export default React.memo(function ChartPanel({ config }: { config: ChartConfig }) {
  const Comp = CHART_MAP[config.type]
  if (!Comp) return null

  return (
    <div className="card">
      <p className="card-title">{config.title}</p>
      <div className="chart-container">
        <Comp
          data={{ labels: config.labels, datasets: config.datasets as never }}
          options={BASE_CHART_OPTIONS as never}
        />
      </div>
    </div>
  )
})