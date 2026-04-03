import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload as UploadIcon, FileText } from 'lucide-react'
import { useCSVParser } from '../hooks/useCSVParser'
import { useAppStore } from '../store/useAppStore'
import { fetchInsights } from '../services/api'

export default function Upload() {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { parseFile } = useCSVParser()
  const { setInsights, setIsLoadingInsights } = useAppStore()
  const navigate = useNavigate()

  const handleFile = useCallback(
    async (file: File) => {
      setError(null)
      if (!file.name.endsWith('.csv')) {
        setError('Please upload a CSV file.')
        return
      }
      setIsLoading(true)
      try {
        const parsed = await parseFile(file)
        navigate('/dashboard')
        setIsLoadingInsights(true)
        fetchInsights(parsed.summary)
          .then((insights) => setInsights(insights))
          .catch(() => setInsights([]))
          .finally(() => setIsLoadingInsights(false))
      } catch {
        setError('Failed to parse CSV. Make sure it has headers.')
      } finally {
        setIsLoading(false)
      }
    },
    [parseFile, navigate, setInsights, setIsLoadingInsights]
  )

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    [handleFile]
  )

  return (
    <div
      onClick={() => !isLoading && document.getElementById('csv-input')?.click()}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={onDrop}
      style={{
        position: 'relative',
        border: `2px dashed ${isDragging ? '#7c5cfc' : '#1e1e2e'}`,
        borderRadius: 20,
        padding: '48px 40px',
        background: isDragging ? 'rgba(124,92,252,0.07)' : '#11111a',
        cursor: isLoading ? 'default' : 'pointer',
        transition: 'all 0.2s',
        transform: isDragging ? 'scale(1.01)' : 'scale(1)',
      }}
      onMouseEnter={(e) => {
        if (!isDragging) e.currentTarget.style.borderColor = 'rgba(124,92,252,0.5)'
      }}
      onMouseLeave={(e) => {
        if (!isDragging) e.currentTarget.style.borderColor = '#1e1e2e'
      }}
    >
      <input
        id="csv-input"
        type="file"
        accept=".csv"
        style={{ display: 'none' }}
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
      />

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, textAlign: 'center' }}>
        {/* Purple gradient icon button — matches original */}
        <div style={{
          width: 64, height: 64, borderRadius: 18,
          background: 'linear-gradient(135deg, #7c5cfc, #5c8cfc)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'transform 0.2s, opacity 0.2s',
          transform: isDragging ? 'scale(1.1)' : 'scale(1)',
        }}>
          {isLoading ? (
            <div style={{
              width: 24, height: 24, borderRadius: '50%',
              border: '2px solid rgba(255,255,255,0.3)',
              borderTopColor: 'white',
              animation: 'spin 0.8s linear infinite',
            }} />
          ) : (
            <UploadIcon style={{ width: 28, height: 28, color: 'white' }} />
          )}
        </div>

        <div>
          <p style={{ color: '#e8e8f0', fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: 18 }}>
            {isLoading ? 'Parsing...' : isDragging ? 'Release to upload' : 'Drop your CSV'}
          </p>
          <p style={{ color: '#8888a8', fontSize: 14, marginTop: 4 }}>or click to browse</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#44445a', fontSize: 12 }}>
          <FileText style={{ width: 13, height: 13 }} />
          CSV files with headers
        </div>
      </div>

      {error && (
        <p style={{ color: '#fc5c5c', fontSize: 13, textAlign: 'center', marginTop: 16 }}>{error}</p>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}