import Papa from 'papaparse'
import { useAppStore } from '../store/useAppStore'
import { sniffAllColumns } from '../utils/columnSniffer'
import { buildDataSummary } from '../utils/dataSummarizer'
import type { ParsedCSV } from '../types'

export function useCSVParser() {
  const { setIsParsingCSV, setParsedCSV, reset } = useAppStore()

  const parseFile = (file: File): Promise<ParsedCSV> =>
    new Promise((resolve, reject) => {
      reset()
      setIsParsingCSV(true)

      Papa.parse<Record<string, string>>(file, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: false,

        complete: (result) => {
          try {
            const headers = result.meta.fields ?? []
            const rows = result.data as Record<string, string>[]

            if (!headers.length || !rows.length) {
              setIsParsingCSV(false)
              return reject(new Error('Empty or invalid CSV'))
            }

            const columnTypes = sniffAllColumns(headers, rows)
            const summary = buildDataSummary(file.name, headers, rows, columnTypes)
            const parsed: ParsedCSV = { headers, rows, summary }

            setParsedCSV(parsed)
            setIsParsingCSV(false)
            resolve(parsed)
          } catch (err) {
            setIsParsingCSV(false)
            reject(err instanceof Error ? err : new Error('Parsing failed'))
          }
        },

        error: (err) => {
          setIsParsingCSV(false)
          reject(err instanceof Error ? err : new Error('Parsing error'))
        },
      })
    })

  return { parseFile }
}