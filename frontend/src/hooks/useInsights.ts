import { useEffect, useRef } from 'react'
import { useAppStore } from '../store/useAppStore'
import { getInsights } from '../services/databridge' // ✅ import from databridge, not api
import type { ParsedCSV } from '../types'

export function useInsights(csv: ParsedCSV | null) {
  const { setInsights, setIsLoadingInsights } = useAppStore()
  const lastFileRef = useRef<string | null>(null)

  useEffect(() => {
    if (!csv) return

    const fileName = csv.summary.fileName
    if (lastFileRef.current === fileName) return
    lastFileRef.current = fileName

    setIsLoadingInsights(true)

    getInsights(csv.summary)           // ✅ DataSummary → buildSummaryText → backend
      .then((insights) => setInsights(insights))
      .catch(() => setInsights([]))
      .finally(() => setIsLoadingInsights(false))
  }, [csv, setInsights, setIsLoadingInsights])
}