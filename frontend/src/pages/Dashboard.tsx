import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, RefreshCw } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { useChartConfig } from '../hooks/useChartConfig'
import { generateLocalInsights, formatNumber } from '../utils/dataSummarizer'
import ChartPanel from '../components/ChartPanel'
import InsightCard from '../components/InsightCard'
import ChatBox from '../components/ChatBox'

export default function Dashboard() {
  const navigate = useNavigate()
  const { parsedCSV, insights, isLoadingInsights, setCharts } = useAppStore()
  const charts = useChartConfig(parsedCSV)

  useEffect(() => { setCharts(charts) }, [charts, setCharts])

  if (!parsedCSV) return null
  const { summary, rows } = parsedCSV

  const localInsights = generateLocalInsights({ rows, summary })
  const allInsights = [...localInsights, ...insights]

  const numericCols = summary.columns.filter(
    (c) => c.type === 'numeric' && !/\b(id|_id|key|code|number|num|no)\b/i.test(c.name) && !/id$/i.test(c.name)
  )
  const catCols = summary.columns.filter((c) => c.type === 'categorical')
  const dateCols = summary.columns.filter((c) => c.type === 'date')

  const revenueCol = numericCols.find((c) =>
    /total|revenue|amount|sales|price|value|spend/i.test(c.name)
  )
  const totalRevenue = revenueCol
    ? rows.reduce((sum, r) => {
        const v = parseFloat((r[revenueCol.name] ?? '').replace(/[$,%]/g, '').trim())
        return sum + (isNaN(v) ? 0 : v)
      }, 0)
    : null

  const dateRange = (() => {
    if (!dateCols.length) return null
    const dates = rows.map((r) => r[dateCols[0].name]).filter(Boolean).sort()
    if (dates.length < 2) return null
    return { from: dates[0], to: dates[dates.length - 1] }
  })()

  const topCatValue = (() => {
    if (!catCols.length || !numericCols.length) return null
    const cat = catCols[0]
    const num = revenueCol ?? numericCols[0]
    const buckets: Record<string, number> = {}
    for (const row of rows) {
      const key = row[cat.name] || 'Unknown'
      const val = parseFloat((row[num.name] ?? '').replace(/[$,%]/g, '').trim())
      if (!isNaN(val)) buckets[key] = (buckets[key] || 0) + val
    }
    const sorted = Object.entries(buckets).sort((a, b) => b[1] - a[1])
    return sorted.length ? { name: sorted[0][0], col: cat.name, value: sorted[0][1], metric: num.name } : null
  })()

  const statStrip = [
    { label: 'Rows', value: summary.rowCount.toLocaleString() },
    { label: 'Columns', value: summary.columnCount },
    { label: 'Numeric', value: numericCols.length },
    { label: 'Categorical', value: catCols.length },
    ...(dateCols.length ? [{ label: 'Date', value: dateCols.length }] : []),
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', color: '#e8e8f0' }}>

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
            style={{ padding: 8, borderRadius: 8, border: 'none', background: 'transparent', color: '#8888a8', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#181825'; e.currentTarget.style.color = '#e8e8f0' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#8888a8' }}
          >
            <ArrowLeft style={{ width: 16, height: 16 }} />
          </button>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 20, height: 20, borderRadius: 6, background: 'linear-gradient(135deg, #7c5cfc, #5c8cfc)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: 'white', fontWeight: 700, fontSize: 10, fontFamily: 'Syne, sans-serif' }}>L</span>
              </div>
              <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 600, color: '#e8e8f0' }}>Lens</span>
            </div>
            <p style={{ color: '#44445a', fontSize: 11, marginTop: 2, fontFamily: 'JetBrains Mono, monospace' }}>
              {summary.fileName} · {summary.rowCount.toLocaleString()} rows
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate('/')}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8, border: '1px solid #28283b', background: '#181825', color: '#8888a8', fontSize: 13, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#e8e8f0' }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#8888a8' }}
        >
          <RefreshCw style={{ width: 13, height: 13 }} />
          New Upload
        </button>
      </header>

      <div style={{ display: 'flex', height: 'calc(100vh - 65px)' }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 28 }}>

          {/* Summary banner */}
          {(totalRevenue !== null || dateRange || topCatValue) && (
            <div style={{
              background: 'linear-gradient(135deg, rgba(124,92,252,0.08), rgba(92,140,252,0.08))',
              border: '1px solid rgba(124,92,252,0.2)',
              borderRadius: 16,
              padding: '16px 20px',
              display: 'flex',
              flexWrap: 'wrap',
              gap: 24,
              alignItems: 'center',
            }}>
              {totalRevenue !== null && (
                <div>
                  <p style={{ color: '#6666a8', fontSize: 11, marginBottom: 2, fontFamily: 'JetBrains Mono, monospace' }}>
                    TOTAL {revenueCol!.name.toUpperCase()}
                  </p>
                  <p style={{ color: '#e8e8f0', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 22 }}>
                    {formatNumber(totalRevenue)}
                  </p>
                </div>
              )}
              {topCatValue && (
                <div>
                  <p style={{ color: '#6666a8', fontSize: 11, marginBottom: 2, fontFamily: 'JetBrains Mono, monospace' }}>
                    TOP {topCatValue.col.toUpperCase()}
                  </p>
                  <p style={{ color: '#e8e8f0', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 22 }}>
                    {topCatValue.name}
                    <span style={{ fontSize: 13, fontWeight: 400, color: '#6666a8', marginLeft: 8 }}>
                      {formatNumber(topCatValue.value)} {topCatValue.metric}
                    </span>
                  </p>
                </div>
              )}
              {dateRange && (
                <div>
                  <p style={{ color: '#6666a8', fontSize: 11, marginBottom: 2, fontFamily: 'JetBrains Mono, monospace' }}>
                    DATE RANGE
                  </p>
                  <p style={{ color: '#e8e8f0', fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: 16 }}>
                    {dateRange.from}
                    <span style={{ color: '#44445a', margin: '0 8px' }}>→</span>
                    {dateRange.to}
                  </p>
                </div>
              )}
              <div style={{ marginLeft: 'auto' }}>
                <p style={{ color: '#6666a8', fontSize: 11, marginBottom: 2, fontFamily: 'JetBrains Mono, monospace' }}>INSIGHTS FOUND</p>
                <p style={{ color: '#e8e8f0', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 22 }}>{allInsights.length}</p>
              </div>
            </div>
          )}

          {/* Stat strip */}
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${statStrip.length}, 1fr)`, gap: 12 }}>
            {statStrip.map(({ label, value }) => (
              <div key={label} style={{ background: '#11111a', border: '1px solid #1e1e2e', borderRadius: 14, padding: '14px 18px' }}>
                <p style={{ color: '#44445a', fontSize: 12 }}>{label}</p>
                <p style={{ color: '#e8e8f0', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 28, marginTop: 4 }}>{value}</p>
              </div>
            ))}
          </div>

          {/* Charts */}
          <section>
            <h2 style={{ color: '#e8e8f0', fontFamily: 'Syne, sans-serif', fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 20, height: 20, borderRadius: 6, background: 'rgba(124,92,252,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7c5cfc', fontSize: 11 }}>▦</span>
              Charts
            </h2>
            {charts.length === 0 ? (
              <div style={{ background: '#11111a', border: '1px solid #1e1e2e', borderRadius: 16, height: 192, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#44445a', fontSize: 14 }}>
                Not enough data to generate charts
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {charts.map((chart, i) => <ChartPanel key={i} config={chart} />)}
              </div>
            )}
          </section>

          {/* Insights */}
          <section>
            <h2 style={{ color: '#e8e8f0', fontFamily: 'Syne, sans-serif', fontWeight: 600, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 20, height: 20, borderRadius: 6, background: 'rgba(92,140,252,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5c8cfc', fontSize: 11 }}>◎</span>
              Insights
              <span style={{ fontSize: 12, color: '#44445a', fontWeight: 400, marginLeft: 4 }}>{allInsights.length} found</span>
            </h2>

            {/* Column overview */}
            <div style={{ background: '#11111a', border: '1px solid #1e1e2e', borderRadius: 14, padding: 16, marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#7c5cfc', boxShadow: '0 0 6px rgba(124,92,252,0.6)' }} />
                <span style={{ color: '#e8e8f0', fontSize: 13, fontWeight: 500 }}>
                  {summary.rowCount.toLocaleString()} rows · {summary.columnCount} columns
                </span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {summary.columns.map((col) => (
                  <span key={col.name} style={{
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
                  }}>
                    {col.name}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {isLoadingInsights && allInsights.length === 0
                ? [1, 2, 3].map((i) => (
                    <div key={i} style={{ height: 80, borderRadius: 14, background: '#11111a', border: '1px solid #1e1e2e' }} className="shimmer" />
                  ))
                : allInsights.map((ins) => <InsightCard key={ins.id} insight={ins} />)
              }
            </div>
          </section>
        </div>

        {/* Chat sidebar */}
        <div style={{ width: 360, borderLeft: '1px solid #1e1e2e', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
          <div style={{ padding: 16, borderBottom: '1px solid #1e1e2e' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 24, height: 24, borderRadius: 8, background: 'linear-gradient(135deg, #7c5cfc, #5c8cfc)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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