import { BarChart2, Sparkles, MessageSquare } from 'lucide-react'
import UploadBox from '../components/upload/UploadBox'

const FEATURES = [
  { icon: BarChart2, label: 'Smart Charts', sub: 'Auto-generated visualizations' },
  { icon: Sparkles, label: 'AI Insights', sub: 'Patterns detected instantly' },
  { icon: MessageSquare, label: 'Chat with Data', sub: 'Ask questions naturally' },
]

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 gap-12">
      <div className="text-center max-w-lg">
        <div
          className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium mb-6 border"
          style={{ borderColor: 'var(--color-border-hi)', color: 'var(--color-accent)' }}
        >
          <Sparkles size={12} />
          AI-Powered Analysis
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
        {FEATURES.map(({ icon: Icon, label, sub }) => (
          <div key={label} className="feature-card">
            <div className="feature-icon">
              <Icon size={20} />
            </div>
            <p className="text-sm font-semibold">{label}</p>
            <p className="text-xs" style={{ color: 'var(--color-muted)' }}>{sub}</p>
          </div>
        ))}
      </div>
    </div>
  )
}