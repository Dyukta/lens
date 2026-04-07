import UploadBox from '../components/upload/UploadBox'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 gap-12">
      <div className="text-center max-w-lg">
        <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium mb-6 border"
          style={{ borderColor: 'var(--color-border-hi)', color: 'var(--color-accent)' }}>
          ✦ AI-Powered Analysis
        </div>
        <h1 className="text-5xl font-bold leading-tight mb-4">
          See your data<br />
          <span className="gradient-text">through Lens</span>
        </h1>
        <p className="text-base mb-8" style={{ color: 'var(--color-muted)' }}>
          Drop a CSV and get instant charts, insights, and a chatbot to explore your data.
        </p>
        <UploadBox />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl">
        <div className="feature-card">
          <div className="feature-icon">📊</div>
          <p className="text-sm font-semibold">Smart Charts</p>
          <p className="text-xs" style={{ color: 'var(--color-muted)' }}>Auto-generated visualizations</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">✦</div>
          <p className="text-sm font-semibold">AI Insights</p>
          <p className="text-xs" style={{ color: 'var(--color-muted)' }}>Patterns detected instantly</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">💬</div>
          <p className="text-sm font-semibold">Chat with Data</p>
          <p className="text-xs" style={{ color: 'var(--color-muted)' }}>Ask questions naturally</p>
        </div>
      </div>
    </div>
  )
}