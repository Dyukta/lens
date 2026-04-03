import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, RefreshCw, SunMedium } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { useChartConfig } from '../hooks/useChartConfig'
import ChartPanel from '../components/ChartPanel'
import InsightCard from '../components/InsightCard'
import ChatBox from '../components/ChatBox'

export default function Dashboard() {
  const navigate = useNavigate()
  const [, setDark] = useState(true)
  const { parsedCSV, insights, isLoadingInsights, setCharts } = useAppStore()
  const charts = useChartConfig(parsedCSV)

  useEffect(() => { setCharts(charts) }, [charts, setCharts])

  if (!parsedCSV) return null
  const { summary } = parsedCSV

  // Only show non-zero type counts in stat strip
  const statStrip = [
    { label: 'Rows',        value: summary.rowCount.toLocaleString() },
    { label: 'Columns',     value: summary.columnCount },
    { label: 'Numeric',     value: summary.columns.filter((c) => c.type === 'numeric').length },
    { label: 'Categorical', value: summary.columns.filter((c) => c.type === 'categorical').length },
    ...(summary.columns.some((c) => c.type === 'date')
      ? [{ label: 'Date', value: summary.columns.filter((c) => c.type === 'date').length }]
      : []),
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', color: '#e8e8f0' }}>

      {/* Header */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 20,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 24px',
        borderBottom: '1px solid #1e1e2e',
        background: 'rgba(10,10,15,0.85)',
        backdropFilter: 'blur(12px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: 8, borderRadius: 8, border: 'none', background: 'transparent',
              color: '#8888a8', cursor: 'pointer', display: 'flex', alignItems: 'center',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#181825'; e.currentTarget.style.color = '#e8e8f0' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#8888a8' }}
          >
            <ArrowLeft style={{ width: 16, height: 16 }} />
          </button>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 20, height: 20, borderRadius: 6,
                background: 'linear-gradient(135deg, #7c5cfc, #5c8cfc)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ color: 'white', fontWeight: 700, fontSize: 10, fontFamily: 'Syne, sans-serif' }}>L</span>
              </div>
              <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 600, color: '#e8e8f0' }}>Lens</span>
            </div>
            <p style={{ color: '#44445a', fontSize: 11, marginTop: 2, fontFamily: 'JetBrains Mono, monospace' }}>
              {summary.fileName} · {summary.rowCount.toLocaleString()} rows
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={() => setDark((d) => !d)}
            style={{
              padding: 8, borderRadius: 8, border: 'none', background: 'transparent',
              color: '#8888a8', cursor: 'pointer',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#181825' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
          >
            <SunMedium style={{ width: 16, height: 16 }} />
          </button>
          <button
            onClick={() => navigate('/')}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 12px', borderRadius: 8,
              border: '1px solid #1e1e2e', background: '#181825',
              color: '#8888a8', fontSize: 13, cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#e8e8f0' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#8888a8' }}
          >
            <RefreshCw style={{ width: 13, height: 13 }} />
            New Upload
          </button>
        </div>
      </header>

      <div style={{ display: 'flex', height: 'calc(100vh - 65px)' }}>

        {/* Main content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 32 }}>

          {/* Stat strip */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${statStrip.length}, 1fr)`,
            gap: 12,
          }}>
            {statStrip.map(({ label, value }) => (
              <div key={label} style={{
                background: '#11111a', border: '1px solid #1e1e2e',
                borderRadius: 14, padding: '14px 18px',
              }}>
                <p style={{ color: '#44445a', fontSize: 12 }}>{label}</p>
                <p style={{
                  color: '#e8e8f0', fontFamily: 'Syne, sans-serif',
                  fontWeight: 700, fontSize: 28, marginTop: 4,
                }}>{value}</p>
              </div>
            ))}
          </div>

          {/* Charts section */}
          <section>
            <h2 style={{
              color: '#e8e8f0', fontFamily: 'Syne, sans-serif',
              fontWeight: 600, marginBottom: 16,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <span style={{
                width: 20, height: 20, borderRadius: 6,
                background: 'rgba(124,92,252,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#7c5cfc', fontSize: 11,
              }}>▦</span>
              Charts
            </h2>

            {charts.length === 0 ? (
              <div style={{
                background: '#11111a', border: '1px solid #1e1e2e',
                borderRadius: 16, height: 192,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#44445a', fontSize: 14,
              }}>
                Not enough data to generate charts
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {charts.map((chart, i) => <ChartPanel key={i} config={chart} />)}
              </div>
            )}
          </section>

          {/* Insights section */}
          <section>
            <h2 style={{
              color: '#e8e8f0', fontFamily: 'Syne, sans-serif',
              fontWeight: 600, marginBottom: 16,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <span style={{
                width: 20, height: 20, borderRadius: 6,
                background: 'rgba(92,140,252,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#5c8cfc', fontSize: 11,
              }}>◎</span>
              Insights
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

              {/* Rows loaded card */}
              <div style={{
                background: '#11111a', border: '1px solid #1e1e2e',
                borderRadius: 14, padding: 16,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: '#7c5cfc',
                    boxShadow: '0 0 6px rgba(124,92,252,0.6)',
                  }} />
                  <span style={{ color: '#e8e8f0', fontSize: 14, fontWeight: 500 }}>
                    {summary.rowCount.toLocaleString()} rows loaded
                  </span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {summary.columns.map((col) => (
                    <span
                      key={col.name}
                      style={{
                        padding: '4px 10px', borderRadius: 8, fontSize: 12,
                        fontFamily: 'JetBrains Mono, monospace',
                        background: '#181825',
                        border: `1px solid ${
                          col.type === 'numeric' ? 'rgba(92,252,168,0.3)' :
                          col.type === 'categorical' ? 'rgba(124,92,252,0.3)' :
                          col.type === 'date' ? 'rgba(92,140,252,0.3)' : 'rgba(30,30,46,1)'
                        }`,
                        color:
                          col.type === 'numeric' ? '#5cfca8' :
                          col.type === 'categorical' ? '#a08cfc' :
                          col.type === 'date' ? '#5c8cfc' : '#44445a',
                      }}
                    >
                      {col.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Column types card */}
              <div style={{
                background: '#11111a', border: '1px solid #1e1e2e',
                borderRadius: 14, padding: 16,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#5c8cfc' }} />
                  <span style={{ color: '#e8e8f0', fontSize: 14, fontWeight: 500 }}>Column types detected</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                  {(['numeric', 'categorical', 'date'] as const).map((t) => {
                    const count = summary.columns.filter((c) => c.type === t).length
                    return (
                      <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#8888a8' }}>
                        <span style={{
                          width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                          background: t === 'numeric' ? '#4ade80' : t === 'categorical' ? '#a78bfa' : '#60a5fa',
                        }} />
                        <span style={{ textTransform: 'capitalize' }}>{t}</span>
                        <span style={{ color: '#44445a', marginLeft: 'auto' }}>{count}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* AI Insights */}
              {isLoadingInsights ? (
                [1, 2, 3].map((i) => (
                  <div key={i} style={{ height: 64, borderRadius: 14 }} className="shimmer" />
                ))
              ) : (
                insights.map((ins) => <InsightCard key={ins.id} insight={ins} />)
              )}
            </div>
          </section>
        </div>

        {/* Chat sidebar */}
        <div style={{
          width: 360, borderLeft: '1px solid #1e1e2e',
          display: 'flex', flexDirection: 'column', flexShrink: 0,
        }}>
          <div style={{ padding: 16, borderBottom: '1px solid #1e1e2e' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 24, height: 24, borderRadius: 8,
                background: 'linear-gradient(135deg, #7c5cfc, #5c8cfc)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ color: 'white', fontSize: 12 }}>✦</span>
              </div>
              <div>
                <p style={{ color: '#e8e8f0', fontWeight: 500, fontSize: 14 }}>Ask Lens</p>
                <p style={{ color: '#44445a', fontSize: 12 }}>Chat with your data</p>
              </div>
            </div>
          </div>
          <ChatBox />
        </div>
      </div>
    </div>
  )
}