import type { ColumnStats, ColumnType, DataSummary, Insight } from '../types'

export function summarizeColumn(
  name: string,
  type: ColumnType,
  values: string[]
): ColumnStats {
  let nullCount = 0
  const nonEmpty: string[] = []

  for (const v of values) {
    if (v == null || v === '') nullCount++
    else nonEmpty.push(v)
  }

  const uniqueCount = new Set(nonEmpty).size

  if (type === 'numeric') {
    const nums: number[] = []
    for (const v of nonEmpty) {
      const n = parseFloat(v.replace(/[$,%]/g, '').trim())
      if (!isNaN(n)) nums.push(n)
    }

    if (nums.length === 0) {
      return { name, type, uniqueCount, nullCount }
    }

    let sum = 0
    let min = nums[0]
    let max = nums[0]

    for (const n of nums) {
      sum += n
      if (n < min) min = n
      if (n > max) max = n
    }

    const mean = parseFloat((sum / nums.length).toFixed(4))

    return {
      name,
      type,
      min,
      max,
      mean,
      uniqueCount,
      nullCount,
    }
  }

  if (type === 'categorical') {
    const freq: Record<string, number> = {}

    for (const v of nonEmpty) {
      freq[v] = (freq[v] || 0) + 1
    }

    const topValues = Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([k]) => k)

    return {
      name,
      type,
      uniqueCount,
      topValues,
      nullCount,
    }
  }

  return { name, type, uniqueCount, nullCount }
}

export function buildDataSummary(
  fileName: string,
  headers: string[],
  rows: Record<string, string>[],
  columnTypes: Record<string, ColumnType>
): DataSummary {
  const columns: ColumnStats[] = headers.map((header) => {
    const values = rows.map((row) => row[header] ?? '')
    return summarizeColumn(header, columnTypes[header] ?? 'unknown', values)
  })

  return {
    fileName,
    rowCount: rows.length,
    columnCount: headers.length,
    columns,
  }
}

export function formatNumber(n: number): string {
  const abs = Math.abs(n)
  if (abs >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
  if (abs >= 1_000) return (n / 1_000).toFixed(1) + 'K'
  const fixed = n.toFixed(2)
  return fixed.endsWith('.00') ? fixed.slice(0, -3) : fixed
}

function isIdentifierColumn(name: string): boolean {
  return /\b(id|_id|key|code|number|num|no)\b/i.test(name) || /id$/i.test(name)
}

function pearsonCorrelation(xs: number[], ys: number[]): number {
  const n = xs.length
  if (n < 3) return 0

  const meanX = xs.reduce((a, b) => a + b, 0) / n
  const meanY = ys.reduce((a, b) => a + b, 0) / n

  let num = 0
  let denomX = 0
  let denomY = 0

  for (let i = 0; i < n; i++) {
    const dx = xs[i] - meanX
    const dy = ys[i] - meanY
    num += dx * dy
    denomX += dx * dx
    denomY += dy * dy
  }

  const denom = Math.sqrt(denomX * denomY)
  return denom === 0 ? 0 : num / denom
}

export function generateLocalInsights(
  csv: { rows: Record<string, string>[]; summary: DataSummary }
): Insight[] {
  const { rows, summary } = csv
  const insights: Insight[] = []

  let idCounter = 0
  const id = () => `local-${idCounter++}`

  const numericCols = summary.columns.filter(
    (c) => c.type === 'numeric' && !isIdentifierColumn(c.name)
  )

  const catCols = summary.columns.filter((c) => c.type === 'categorical')
  const dateCols = summary.columns.filter((c) => c.type === 'date')
  const allCols = summary.columns

  // 1. Missing data
  const colsWithNulls = allCols.filter((c) => c.nullCount > 0)
  if (colsWithNulls.length) {
    const worst = colsWithNulls.sort((a, b) => b.nullCount - a.nullCount)[0]
    const pct = ((worst.nullCount / summary.rowCount) * 100).toFixed(0)

    insights.push({
      id: id(),
      type: 'anomaly',
      title: `Missing data in ${worst.name}`,
      description: `${worst.nullCount} of ${summary.rowCount} rows (${pct}%) have no value for "${worst.name}".`,
    })
  }

  // 2. Category vs numeric
  if (catCols.length && numericCols.length) {
    const cat = catCols[0]

    const num =
      numericCols.find((c) =>
        /total|revenue|amount|sales|price|value|spend/i.test(c.name)
      ) ?? numericCols[0]

    const buckets: Record<string, number[]> = {}

    for (const row of rows) {
      const key = row[cat.name] || 'Unknown'
      const val = parseFloat(
        (row[num.name] ?? '').replace(/[$,%]/g, '').trim()
      )

      if (isNaN(val)) continue
      if (!buckets[key]) buckets[key] = []
      buckets[key].push(val)
    }

    const avgs = Object.entries(buckets)
      .map(([k, vals]) => {
        const total = vals.reduce((a, b) => a + b, 0)
        return { key: k, avg: total / vals.length, total, count: vals.length }
      })
      .sort((a, b) => b.avg - a.avg)

    if (avgs.length >= 2) {
      const top = avgs[0]
      const bottom = avgs[avgs.length - 1]

      const diff =
        bottom.avg !== 0
          ? (((top.avg - bottom.avg) / bottom.avg) * 100).toFixed(0)
          : '0'

      insights.push({
        id: id(),
        type: 'trend',
        title: `${top.key} leads ${cat.name}`,
        description: `${formatNumber(top.avg)} vs ${formatNumber(
          bottom.avg
        )} (${diff}% difference)`,
      })
    }

    if (/total|revenue|amount|sales|price|value|spend/i.test(num.name)) {
      const grandTotal = avgs.reduce((a, b) => a + b.total, 0)

      if (grandTotal > 0) {
        const topShare = ((avgs[0].total / grandTotal) * 100).toFixed(0)

        insights.push({
          id: id(),
          type: 'summary',
          title: `Total ${num.name}: ${formatNumber(grandTotal)}`,
          description: `${avgs[0].key} contributes ${topShare}%`,
        })
      }
    }
  }

  // 3. Correlation
  if (numericCols.length >= 2) {
    for (let i = 0; i < numericCols.length - 1; i++) {
      for (let j = i + 1; j < numericCols.length; j++) {
        const colA = numericCols[i]
        const colB = numericCols[j]

        const pairs: [number, number][] = []

        for (const row of rows) {
          const a = parseFloat(
            (row[colA.name] ?? '').replace(/[$,%]/g, '').trim()
          )
          const b = parseFloat(
            (row[colB.name] ?? '').replace(/[$,%]/g, '').trim()
          )

          if (!isNaN(a) && !isNaN(b)) pairs.push([a, b])
        }

        if (pairs.length < 5) continue

        const r = pearsonCorrelation(
          pairs.map(([a]) => a),
          pairs.map(([, b]) => b)
        )

        if (Math.abs(r) >= 0.6) {
          insights.push({
            id: id(),
            type: 'correlation',
            title: `${colA.name} vs ${colB.name}`,
            description: `r = ${r.toFixed(2)}`,
          })
        }
      }
    }
  }

  // 4. Date range
  if (dateCols.length) {
    const col = dateCols[0]

    const dates = rows
      .map((r) => r[col.name])
      .filter(Boolean)
      .sort()

    if (dates.length >= 2) {
      insights.push({
        id: id(),
        type: 'summary',
        title: `Date range`,
        description: `${dates[0]} → ${dates[dates.length - 1]}`,
      })
    }
  }

  return insights
}