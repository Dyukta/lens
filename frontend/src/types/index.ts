export type ColumnType = 'numeric' | 'categorical' | 'date' | 'unknown'

export interface ColumnStats {
  name: string
  type: ColumnType
  uniqueCount: number
  nullCount: number
  min?: number
  max?: number
  mean?: number
  topValues?: string[]
}

export interface DataSummary {
  fileName: string
  rowCount: number
  columnCount: number
  columns: ColumnStats[]
}

export interface ParsedCSV {
  headers: string[]
  rows: Record<string, string>[]
  summary: DataSummary
}

export type InsightType = 'trend' | 'anomaly' | 'correlation' | 'distribution' | 'summary'

export interface Insight {
  id: string
  title: string
  description: string
  type: InsightType
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  isStreaming?: boolean
}

export interface ChartDataset {
  label: string
  data: number[] | { x: number; y: number }[]
  backgroundColor?: string | string[]
  borderColor?: string | string[]
  borderWidth?: number
  fill?: boolean
  tension?: number
  pointBackgroundColor?: string
}

export type ChartType = 'bar' | 'line' | 'pie' | 'doughnut' | 'scatter'

export interface ChartConfig {
  type: ChartType
  title: string
  labels: string[]
  datasets: ChartDataset[]
  xLabel?: string
  yLabel?: string
}