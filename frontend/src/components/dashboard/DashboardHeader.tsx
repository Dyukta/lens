import { ArrowLeft, RefreshCw } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../../store/useAppStore'

export default function DashboardHeader() {
  const navigate = useNavigate()
  const summary = useAppStore((s) => s.parsedCSV?.summary)

  return (
    <header
      className="flex items-center justify-between px-5 py-3 border-b shrink-0"
      style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg)' }}
    >
      <div className="flex items-center gap-3">
        <button
          className="btn-ghost p-1.5 rounded-lg"
          onClick={() => navigate('/')}
          aria-label="Back"
        >
          <ArrowLeft size={16} />
        </button>
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold text-white"
            style={{ background: 'var(--color-accent)' }}
          >
            L
          </div>
          <div>
            <p className="text-sm font-semibold leading-none">Lens</p>
            {summary && (
              <p className="text-xs mt-0.5" style={{ color: 'var(--color-muted)' }}>
                {summary.fileName} · {summary.rowCount} rows
              </p>
            )}
          </div>
        </div>
      </div>
      <button className="btn-outline flex items-center gap-2" onClick={() => navigate('/')}>
        <RefreshCw size={13} />
        New Upload
      </button>
    </header>
  )
}