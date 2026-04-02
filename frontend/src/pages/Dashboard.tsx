import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, SunMedium, Moon, RefreshCw } from 'lucide-react'

import { useAppStore } from '../store/useAppStore'
import { useChartConfig } from '../hooks/useChartConfig'

import ChartPanel from '../components/ChartPanel'
import InsightCard from '../components/InsightCard'
import ChatBox from '../components/ChatBox'

import type { ColumnStats, Insight } from '../types'

export default function Dashboard() {
  const navigate = useNavigate()
  const [dark, setDark] = useState(true)

  const { parsedCSV, insights, isLoadingInsights, setCharts } = useAppStore()
  const charts = useChartConfig(parsedCSV)

  useEffect(() => {
    setCharts(charts)
  }, [charts, setCharts])

  if (!parsedCSV) return null

  const { summary } = parsedCSV

  const numericCount = summary.columns.filter(
    (c: ColumnStats) => c.type === 'numeric'
  ).length

  const categoricalCount = summary.columns.filter(
    (c: ColumnStats) => c.type === 'categorical'
  ).length

  const dateCount = summary.columns.filter(
    (c: ColumnStats) => c.type === 'date'
  ).length

  return (
    <div className="min-h-screen bg-bg-base text-text-primary">
    
      <header className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 border-b border-bg-border bg-bg-base/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="p-2 rounded-lg hover:bg-bg-elevated text-text-secondary hover:text-text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-gradient-lens flex items-center justify-center">
                <span className="text-white font-display font-bold text-[10px]">
                  L
                </span>
              </div>
              <span className="font-display font-semibold text-text-primary">
                Lens
              </span>
            </div>

            <p className="text-text-muted text-xs mt-0.5 font-mono">
              {summary.fileName} · {summary.rowCount.toLocaleString()} rows
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setDark((prev) => !prev)}
            className="p-2 rounded-lg hover:bg-bg-elevated text-text-secondary hover:text-text-primary transition-colors"
          >
            {dark ? (
              <SunMedium className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>

          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-bg-elevated border border-bg-border text-text-secondary hover:text-text-primary text-sm transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            New Upload
          </button>
        </div>
      </header>

      {/* BODY */}
      <div className="flex h-[calc(100vh-65px)]">
        {/* LEFT */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* STATS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Rows', value: summary.rowCount.toLocaleString() },
              { label: 'Columns', value: summary.columnCount },
              { label: 'Numeric', value: numericCount },
              { label: 'Categorical', value: categoricalCount },
              { label: 'Date', value: dateCount }
            ].map((item) => (
              <div
                key={item.label}
                className="bg-bg-surface border border-bg-border rounded-xl px-4 py-3"
              >
                <p className="text-text-muted text-xs">{item.label}</p>
                <p className="text-text-primary font-display font-semibold text-xl mt-0.5">
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          {/* CHARTS */}
          <section>
            <h2 className="text-text-primary font-display font-semibold mb-4">
              Charts
            </h2>

            {charts.length === 0 ? (
              <div className="bg-bg-surface border border-bg-border rounded-2xl h-48 flex items-center justify-center text-text-muted text-sm">
                Not enough data to generate charts
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {charts.map((chart, i) => (
                  <ChartPanel key={i} config={chart} />
                ))}
              </div>
            )}
          </section>

          {/* INSIGHTS */}
          <section>
            <h2 className="text-text-primary font-display font-semibold mb-4">
              Insights
            </h2>

            <div className="space-y-3">
              {/* SUMMARY CARD */}
              <div className="bg-bg-surface border border-bg-border rounded-xl p-4">
                <p className="text-text-primary text-sm font-medium mb-2">
                  {summary.rowCount.toLocaleString()} rows loaded
                </p>

                <div className="flex flex-wrap gap-2">
                  {summary.columns.map((col: ColumnStats) => (
                    <span
                      key={col.name}
                      className="px-2 py-1 text-xs border rounded"
                    >
                      {col.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* LOADING */}
              {isLoadingInsights ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 rounded-xl shimmer" />
                  ))}
                </div>
              ) : (
                insights.map((insight: Insight) => (
                  <InsightCard key={insight.id} insight={insight} />
                ))
              )}
            </div>
          </section>
        </div>

        {/* RIGHT CHAT */}
        <div className="w-[360px] border-l border-bg-border flex flex-col">
          <div className="p-4 border-b border-bg-border">
            <p className="text-sm font-medium">Ask Lens</p>
            <p className="text-xs text-text-muted">Chat with your data</p>
          </div>

          <ChatBox />
        </div>
      </div>
    </div>
  )
}