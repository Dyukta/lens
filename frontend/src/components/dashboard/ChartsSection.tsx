import React from 'react'
import { useAppStore } from '../../store/useAppStore'
import { useChartConfig } from '../../hooks/useChartConfig'
import ChartPanel from '../shared/ChartPanel'

const ChartsSection: React.FC = () => {
  const parsedCSV = useAppStore((s) => s.parsedCSV)
  const charts = useChartConfig(parsedCSV)

  if (!charts || charts.length === 0)
    return <div className="text-gray-500 p-4">No charts available</div>

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      {charts.map((config, i) => (
        <ChartPanel key={`${config.title}-${i}`} config={config} />
      ))}
    </div>
  )
}

export default ChartsSection