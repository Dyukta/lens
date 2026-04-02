import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Bar, Line, Doughnut, Pie, Scatter } from 'react-chartjs-2'
import type { ChartConfig } from '../types'
import { BASE_CHART_OPTIONS } from '../constants/charts'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface Props {
  config: ChartConfig
}

const NO_SCALE_TYPES = new Set(['pie', 'doughnut'])

export default function ChartPanel({ config }: Props) {
  const { type, title, labels, datasets, xLabel, yLabel } = config

  const isNoScale = NO_SCALE_TYPES.has(type)

  const options = {
    ...BASE_CHART_OPTIONS,
    plugins: {
      ...BASE_CHART_OPTIONS.plugins,
      legend: {
        ...BASE_CHART_OPTIONS.plugins.legend,
        display: isNoScale || datasets.length > 1,
      },
    },
    ...(isNoScale
      ? {}
      : {
          scales: {
            x: {
              ...BASE_CHART_OPTIONS.scales.x,
              ...(xLabel && {
                title: {
                  display: true,
                  text: xLabel,
                  color: '#44445a',
                  font: { family: 'DM Sans', size: 11 },
                },
              }),
            },
            y: {
              ...BASE_CHART_OPTIONS.scales.y,
              ...(yLabel && {
                title: {
                  display: true,
                  text: yLabel,
                  color: '#44445a',
                  font: { family: 'DM Sans', size: 11 },
                },
              }),
            },
          },
        }),
  }

  const data = { labels, datasets }

  return (
    <Wrapper title={title}>
      {type === 'bar' && <Bar data={data} options={options} />}
      {type === 'line' && <Line data={data} options={options} />}
      {type === 'doughnut' && <Doughnut data={data} options={options} />}
      {type === 'pie' && <Pie data={data} options={options} />}
      {type === 'scatter' && <Scatter data={data as any} options={options} />}
    </Wrapper>
  )
}

function Wrapper({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-bg-surface border border-bg-border rounded-2xl p-5 hover:border-accent-purple/20 transition-colors">
      <p className="text-text-secondary text-xs font-medium mb-4 uppercase tracking-wider">
        {title}
      </p>
      <div className="chart-container">{children}</div>
    </div>
  )
}