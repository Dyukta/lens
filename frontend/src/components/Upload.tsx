import { useCallback, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload as UploadIcon, FileText } from 'lucide-react'
import { useCSVParser } from '../hooks/useCSVParser'
import { useAppStore } from '../store/useAppStore'
import { fetchInsights } from '../services/api'

export default function Upload() {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)

  const { parseFile } = useCSVParser()
  const { setInsights, setIsLoadingInsights } = useAppStore()
  const navigate = useNavigate()

  const handleFile = useCallback(
    async (file: File) => {
      if (isLoading) return

      setError(null)

      if (!file.name.toLowerCase().endsWith('.csv')) {
        setError('Please upload a CSV file.')
        return
      }

      setIsLoading(true)

      try {
        const parsed = await parseFile(file)

        navigate('/dashboard')

        setIsLoadingInsights(true)

        try {
          const insights = await fetchInsights(parsed.summary)
          setInsights(insights)
        } catch {
          setInsights([])
        } finally {
          setIsLoadingInsights(false)
        }
      } catch {
        setError('Failed to parse CSV. Make sure it has headers.')
      } finally {
        setIsLoading(false)
      }
    },
    [isLoading, parseFile, navigate, setInsights, setIsLoadingInsights]
  )

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      const file = e.dataTransfer.files?.[0]
      if (file) handleFile(file)
    },
    [handleFile]
  )

  return (
    <div
      className={`relative border-2 border-dashed rounded-2xl p-12 transition-all duration-200 cursor-pointer group
        ${
          isDragging
            ? 'border-accent-purple bg-accent-glow scale-[1.01]'
            : 'border-bg-border bg-bg-surface hover:border-accent-purple/50 hover:bg-bg-elevated'
        }`}
      onDragOver={(e) => {
        e.preventDefault()
        if (!isDragging) setIsDragging(true)
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={onDrop}
      onClick={() => {
        if (!isLoading) inputRef.current?.click()
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
        }}
      />

      {isDragging && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-radial from-accent-glow to-transparent pointer-events-none" />
      )}

      <div className="flex flex-col items-center gap-4 text-center">
        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-200
          bg-gradient-lens group-hover:scale-110 ${isDragging ? 'scale-110' : ''}`}
        >
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <UploadIcon className="w-7 h-7 text-white" />
          )}
        </div>

        <div>
          <p className="text-text-primary font-display font-semibold text-lg">
            {isLoading
              ? 'Parsing...'
              : isDragging
              ? 'Release to upload'
              : 'Drop your CSV'}
          </p>
          <p className="text-text-secondary text-sm mt-1">
            or click to browse
          </p>
        </div>

        <div className="flex items-center gap-2 text-text-muted text-xs">
          <FileText className="w-3.5 h-3.5" />
          <span>CSV files with headers</span>
        </div>
      </div>

      {error && (
        <p className="mt-4 text-center text-red-400 text-sm">{error}</p>
      )}
    </div>
  )
}