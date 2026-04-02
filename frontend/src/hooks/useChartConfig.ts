import { useMemo } from 'react'
import type { ParsedCSV, ChartConfig } from '../types'
import {
  CHART_COLORS_ARRAY,
  CHART_BORDER_ARRAY,
  MAX_CATEGORIES_PIE,
  MAX_BARS,
  MAX_SCATTER_POINTS,
} from '../constants/charts'

function frequencyMap(values: string[]): Record<string, number> {
  const freq: Record<string, number> = {}
  for (const v of values) {
    if (!v) continue
    freq[v] = (freq[v] || 0) + 1
  }
  return freq
}

export function useChartConfig(csv: ParsedCSV | null): ChartConfig[] {
  return useMemo(() => {
    if (!csv) return []

    const { rows, summary } = csv
    const charts: ChartConfig[] = []
    const cols = summary.columns

    const numericCols = cols.filter((c) => c.type === 'numeric')
    const catCols = cols.filter((c) => c.type === 'categorical')
    const dateCols = cols.filter((c) => c.type === 'date')

    if (catCols.length && numericCols.length) {
      const cat = catCols[0]
      const num = numericCols[0]

      const buckets: Record<string, { sum: number; count: number }> = {}

      for (const row of rows) {
        const key = row[cat.name] || 'Unknown'
        const raw = row[num.name]
        const value = raw ? parseFloat(raw) : NaN

        if (isNaN(value)) continue

        if (!buckets[key]) buckets[key] = { sum: 0, count: 0 }

        buckets[key].sum += value
        buckets[key].count++
      }

      const sorted = Object.entries(buckets)
        .sort((a, b) => b[1].count - a[1].count)
        .slice(0, MAX_BARS)

      if (sorted.length) {
        charts.push({
          type: 'bar',
          title: `Avg ${num.name} by ${cat.name}`,
          labels: sorted.map(([k]) => k),
          datasets: [
            {
              label: `Avg ${num.name}`,
              data: sorted.map(([, v]) =>
                parseFloat((v.sum / v.count).toFixed(2))
              ),
              backgroundColor: CHART_COLORS_ARRAY[0],
              borderColor: CHART_BORDER_ARRAY[0],
              borderWidth: 1,
            },
          ],
          xLabel: cat.name,
          yLabel: num.name,
        })
      }
    }

    if (catCols.length) {
      const cat = catCols[0]
      const fm = frequencyMap(rows.map((r) => r[cat.name]))

      const sorted = Object.entries(fm)
        .sort((a, b) => b[1] - a[1])
        .slice(0, MAX_CATEGORIES_PIE)

      if (sorted.length >= 2) {
        charts.push({
          type: 'doughnut',
          title: `Distribution of ${cat.name}`,
          labels: sorted.map(([k]) => k),
          datasets: [
            {
              label: cat.name,
              data: sorted.map(([, v]) => v),
              backgroundColor: CHART_COLORS_ARRAY.slice(0, sorted.length),
              borderColor: CHART_BORDER_ARRAY.slice(0, sorted.length),
              borderWidth: 1,
            },
          ],
        })
      }
    }

    if (dateCols.length && numericCols.length) {
      const dateCol = dateCols[0]
      const numCol = numericCols[0]

      const buckets: Record<string, { sum: number; count: number }> = {}

      for (const row of rows) {
        const key = row[dateCol.name]
        const raw = row[numCol.name]
        const value = raw ? parseFloat(raw) : NaN

        if (!key || isNaN(value)) continue

        if (!buckets[key]) buckets[key] = { sum: 0, count: 0 }

        buckets[key].sum += value
        buckets[key].count++
      }

      const sorted = Object.entries(buckets)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .slice(0, 60)

      if (sorted.length >= 3) {
        charts.push({
          type: 'line',
          title: `${numCol.name} over ${dateCol.name}`,
          labels: sorted.map(([k]) => k),
          datasets: [
            {
              label: numCol.name,
              data: sorted.map(([, v]) =>
                parseFloat((v.sum / v.count).toFixed(2))
              ),
              borderColor: CHART_BORDER_ARRAY[1],
              backgroundColor: 'rgba(92, 140, 252, 0.1)',
              borderWidth: 2,
              fill: true,
              tension: 0.4,
              pointBackgroundColor: CHART_BORDER_ARRAY[1],
            },
          ],
          xLabel: dateCol.name,
          yLabel: numCol.name,
        })
      }
    }

    if (numericCols.length >= 2) {
      const xCol = numericCols[0]
      const yCol = numericCols[1]

      const points = []

      for (let i = 0; i < rows.length && points.length < MAX_SCATTER_POINTS; i++) {
        const r = rows[i]
        const x = parseFloat(r[xCol.name])
        const y = parseFloat(r[yCol.name])

        if (!isNaN(x) && !isNaN(y)) {
          points.push({ x, y })
        }
      }

      if (points.length >= 5) {
        charts.push({
          type: 'scatter',
          title: `${xCol.name} vs ${yCol.name}`,
          labels: [],
          datasets: [
            {
              label: `${xCol.name} vs ${yCol.name}`,
              data: points as unknown as number[],
              backgroundColor: CHART_COLORS_ARRAY[3],
              borderColor: CHART_BORDER_ARRAY[3],
              borderWidth: 1,
            },
          ],
          xLabel: xCol.name,
          yLabel: yCol.name,
        })
      }
    }

    if (numericCols.length >= 3) {
      charts.push({
        type: 'bar',
        title: 'Numeric Column Statistics',
        labels: ['Min', 'Mean', 'Max'],
        datasets: numericCols.slice(0, 4).map((col, i) => ({
          label: col.name,
          data: [col.min ?? 0, col.mean ?? 0, col.max ?? 0],
          backgroundColor: CHART_COLORS_ARRAY[i],
          borderColor: CHART_BORDER_ARRAY[i],
          borderWidth: 1,
        })),
      })
    }

    return charts
  }, [csv])
}