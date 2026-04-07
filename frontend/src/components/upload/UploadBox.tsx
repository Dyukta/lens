import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCSVParser } from '../../hooks/useCSVParser'

export default function UploadBox() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { parseFile } = useCSVParser()
  const navigate = useNavigate()

  const handle = async (file: File) => {
    if (!file.name.endsWith('.csv')) {
      setError('Only CSV files allowed')
      return
    }

    setError('')
    setLoading(true)

    try {
      await parseFile(file)
      navigate('/dashboard')
    } catch {
      setError('Failed to process file')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="upload-box">
      <input
        type="file"
        accept=".csv"
        onChange={(e) => e.target.files && handle(e.target.files[0])}
      />
      <p>{loading ? 'Processing...' : 'Upload CSV'}</p>
      {error && <span className="error">{error}</span>}
    </div>
  )
}