import { useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, FileText } from 'lucide-react'
import { useCSVParser } from '../../hooks/useCSVParser'

export default function UploadBox() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const { parseFile } = useCSVParser()
  const navigate = useNavigate()

  const handle = useCallback(async (file: File) => {
    if (!file.name.endsWith('.csv')) {
      setError('Only CSV files are supported')
      return
    }
    setError('')
    setLoading(true)
    try {
      await parseFile(file)
      navigate('/dashboard')
    } catch {
      setError('Failed to process file. Check that it has headers and valid data.')
    } finally {
      setLoading(false)
    }
  }, [parseFile, navigate])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handle(file)
  }, [handle])

  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true) }
  const onDragLeave = () => setIsDragging(false)

  return (
    <div
      className={`drop-zone${isDragging ? ' drag-over' : ''}`}
      onClick={() => !loading && inputRef.current?.click()}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handle(e.target.files[0])}
      />

      <div className="flex flex-col items-center gap-3 pointer-events-none">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{ background: 'var(--color-accent)', color: '#fff' }}
        >
          <Upload size={24} />
        </div>
        <div>
          <p className="font-semibold text-base">
            {loading ? 'Processing…' : 'Drop your CSV'}
          </p>
          <p className="text-sm mt-0.5" style={{ color: 'var(--color-muted)' }}>
            {loading ? 'Parsing file and building charts' : 'or click to browse'}
          </p>
        </div>
        {!loading && (
          <p className="text-xs flex items-center gap-1.5" style={{ color: 'var(--color-muted)' }}>
            <FileText size={12} />
            CSV files with headers
          </p>
        )}
      </div>

      {error && (
        <p className="mt-4 text-sm text-center" style={{ color: '#fc5c5c' }}>{error}</p>
      )}
    </div>
  )
}