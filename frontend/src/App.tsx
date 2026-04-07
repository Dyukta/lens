import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import { useAppStore } from './store/useAppStore'

export default function App() {
  const parsedCSV = useAppStore((s) => s.parsedCSV)

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/dashboard"
        element={parsedCSV ? <Dashboard /> : <Navigate to="/" replace />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}