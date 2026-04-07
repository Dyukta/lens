import { useAppStore } from '../store/useAppStore'
import { Navigate } from 'react-router-dom'
import DashboardHeader from '../components/dashboard/DashboardHeader'
import SummaryStrip from '../components/dashboard/SummaryStrip'
import ChartsSection from '../components/dashboard/ChartsSection'
import InsightsSection from '../components/dashboard/InsightsSection'
import ChatDock from '../components/dashboard/ChatDock'

export default function Dashboard() {
  const parsedCSV = useAppStore((s) => s.parsedCSV)

  if (!parsedCSV) return <Navigate to="/" replace />

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: 'var(--color-bg)' }}>
      <DashboardHeader />
      <SummaryStrip />
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
          <ChartsSection />
          <InsightsSection />
        </main>
        <ChatDock />
      </div>
    </div>
  )
}