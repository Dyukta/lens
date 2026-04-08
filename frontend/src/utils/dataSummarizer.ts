import type { ColumnStats, ColumnType, DataSummary } from '../types'

export function summarizeColumn(name: string, type: ColumnType, values: string[]): ColumnStats {
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

    if (nums.length === 0) return { name, type, uniqueCount, nullCount }

    let sum = 0
    let min = nums[0]
    let max = nums[0]

    for (const n of nums) {
      sum += n
      if (n < min) min = n
      if (n > max) max = n
    }

    return {
      name,
      type,
      min,
      max,
      mean: parseFloat((sum / nums.length).toFixed(4)),
      uniqueCount,
      nullCount,
    }
  }

  if (type === 'categorical') {
    const freq: Record<string, number> = {}
    for (const v of nonEmpty) freq[v] = (freq[v] || 0) + 1

    const topValues = Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([k]) => k)

    return { name, type, uniqueCount, topValues, nullCount }
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

  return { fileName, rowCount: rows.length, columnCount: headers.length, columns }
}

export function formatNumber(n: number): string {
  const abs = Math.abs(n)
  if (abs >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
  if (abs >= 1_000) return (n / 1_000).toFixed(1) + 'K'
  const fixed = n.toFixed(2)
  return fixed.endsWith('.00') ? fixed.slice(0, -3) : fixed
}

export function buildSummaryText(summary: DataSummary): string {
  const cols = summary.columns.map((col) => {
    let parts = `${col.name}(${col.type})`
    if (col.nullCount > 0) parts += ` nulls:${col.nullCount}`
    if (col.type === 'numeric' && col.min !== undefined && col.max !== undefined) {
      parts += ` min:${formatNumber(col.min)} max:${formatNumber(col.max)}`
      if (col.mean !== undefined) parts += ` mean:${formatNumber(col.mean)}`
    }
    if (col.type === 'categorical' && col.topValues?.length) {
      parts += ` top:[${col.topValues.slice(0, 3).join(',')}]`
    }
    return parts
  }).join(' | ')

  return `File:${summary.fileName} Rows:${summary.rowCount} Cols:${summary.columnCount}\n${cols}`
}


