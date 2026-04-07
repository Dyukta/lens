import { useAppStore } from '../../store/useAppStore'
import { useInsights } from '../../hooks/useInsights'
import InsightCard from '../shared/InsightCard'
import Loader from '../shared/Loader'

export default function InsightsSection() {
  const parsedCSV = useAppStore((s) => s.parsedCSV)
  const insights = useAppStore((s) => s.insights)
  const isLoading = useAppStore((s) => s.isLoadingInsights)

  useInsights(parsedCSV)

  if (isLoading) return (
    <div className="py-8">
      <Loader label="Generating insights…" />
    </div>
  )

  if (!insights.length) return (
    <p className="text-sm px-1" style={{ color: 'var(--color-muted)' }}>
      No insights available.
    </p>
  )

  return (
    <section>
      <div className="flex items-center gap-2 mb-3">
        <span className="w-2 h-2 rounded-full" style={{ background: 'var(--color-accent)' }} />
        <h2 className="text-sm font-semibold uppercase tracking-widest" style={{ color: 'var(--color-muted)' }}>
          Insights
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {insights.map((insight) => (
          <InsightCard key={insight.id} insight={insight} />
        ))}
      </div>
    </section>
  )
}