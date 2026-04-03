import { motion } from 'framer-motion'
import { Sparkles, BarChart2, MessageSquare } from 'lucide-react'
import Upload from '../components/Upload'

const features = [
  {
    icon: BarChart2,
    title: 'Smart Charts',
    desc: 'Auto-generated visualizations',
    gradient: 'linear-gradient(135deg, #e45cfc, #5c8cfc)',
  },
  {
    icon: Sparkles,
    title: 'AI Insights',
    desc: 'Patterns detected instantly',
    gradient: 'linear-gradient(135deg, #e45cfc, #5cd2fc)',
  },
  {
    icon: MessageSquare,
    title: 'Chat with Data',
    desc: 'Ask questions naturally',
    gradient: 'linear-gradient(135deg, #e45cfc, #7c5cfc)',
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-bg-base flex flex-col overflow-hidden">

    
      <div className="fixed inset-0 pointer-events-none">
        <div style={{
          position: 'absolute', top: '-20%', left: '30%',
          width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,92,252,0.07) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-10%', right: '20%',
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(92,140,252,0.06) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }} />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center px-8 py-5">
        <div className="flex items-center gap-2">
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: 'linear-gradient(135deg, #e45cfc, #5c8cfc)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ color: 'white', fontWeight: 700, fontSize: 13, fontFamily: 'Syne, sans-serif' }}>L</span>
          </div>
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 600, color: '#9a9abc', fontSize: 18 }}>
            Lens
          </span>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl w-full"
        >

          <h1 style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: 'clamp(40px, 6vw, 64px)',
            fontWeight: 800,
            lineHeight: 1.15,
            color: '#ffffff',
            marginBottom: 16,
          }}>
            See your data
            <br />
            <span className="gradient-text">through Lens</span>
          </h1>

          <p style={{ color: '#9a9abc', fontSize: 18, lineHeight: 1.6, marginBottom: 48 }}>
            Drop a CSV and get instant charts, insights and a chatbot
            <br /> to explore your data.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            style={{ maxWidth: 520, margin: '0 auto' }}
          >
            <Upload />
          </motion.div>
        </motion.div>

        {/* Feature cards */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 16,
            marginTop: 64,
            maxWidth: 560,
            width: '100%',
          }}
        >
          {features.map(({ icon: Icon, title, desc, gradient }) => (
            <div
              key={title}
              style={{
                background: '#11111a',
                border: '1px solid #1e1e2e',
                borderRadius: 16,
                padding: '20px 16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 12,
                textAlign: 'center',
                transition: 'border-color 0.2s',
                cursor: 'default',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(124,92,252,0.4)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#1e1e2e')}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: gradient,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon style={{ width: 20, height: 20, color: 'white' }} />
              </div>
              <div>
                <p style={{ color: '#e8e8f0', fontWeight: 500, fontSize: 14 }}>{title}</p>
                <p style={{ color: '#9a9abc', fontSize: 12, marginTop: 2 }}>{desc}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </main>
    </div>
  )
}