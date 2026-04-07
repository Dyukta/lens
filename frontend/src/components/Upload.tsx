import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCSVParser } from '../hooks/useCSVParser'

export default function Upload() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { parseFile } = useCSVParser()
  const navigate = useNavigate()

  const handle = async (file: File) => {
    if (!file.name.endsWith('.csv')) return setError('Invalid file')

    setLoading(true)
    try {
      await parseFile(file)
      navigate('/dashboard')
    } catch {
      setError('Failed to parse file')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="upload-box">
      <input type="file" accept=".csv" onChange={(e) => e.target.files && handle(e.target.files[0])} />

      <p>{loading ? 'Processing...' : 'Upload CSV'}</p>

      {error && <p className="error">{error}</p>}
    </div>
  )
}