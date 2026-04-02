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

export type InsightType =
  | 'trend'
  | 'anomaly'
  | 'correlation'
  | 'distribution'
  | 'summary'

export interface Insight {
  id: string
  title: string
  description: string
  type: InsightType
}

export interface ChatHistoryItem {
  role: 'user' | 'assistant'
  content: string
}