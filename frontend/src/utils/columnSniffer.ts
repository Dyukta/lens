import type { ColumnType } from '../types'

const DATE_PATTERNS = [
  /^\d{4}-\d{2}-\d{2}$/,
  /^\d{2}\/\d{2}\/\d{4}$/,
  /^\d{2}-\d{2}-\d{4}$/,
  /^\d{4}\/\d{2}\/\d{2}$/,
  /^\w{3}\s\d{1,2},?\s\d{4}$/i,
  /^\d{1,2}\s\w+\s\d{4}$/i,
]

export function sniffColumnType(values: string[]): ColumnType {
  const nonEmpty = values.filter((v) => v != null && v !== '')
  if (nonEmpty.length === 0) return 'unknown'

  const sample = nonEmpty.slice(0, 50)
  let numericCount = 0
  let dateCount = 0

  for (const raw of sample) {
    const v = raw.trim()
    if (!isNaN(Number(v.replace(/[$,%]/g, '')))) {
      numericCount++
      continue
    }
    if (DATE_PATTERNS.some((p) => p.test(v)) || (!isNaN(new Date(v).getTime()) && v.length > 4)) {
      dateCount++
    }
  }

  if (numericCount / sample.length >= 0.85) return 'numeric'
  if (dateCount / sample.length >= 0.75) return 'date'
  return 'categorical'
}

export function sniffAllColumns(
  headers: string[],
  rows: Record<string, string>[]
): Record<string, ColumnType> {
  const result: Record<string, ColumnType> = {}
  for (const header of headers) {
    const values = rows.map((row) => row[header] ?? '')
    result[header] = sniffColumnType(values)
  }
  return result
}