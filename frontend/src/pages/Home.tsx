import { motion } from 'framer-motion'
import { Sparkles, BarChart2, MessageSquare } from 'lucide-react'
import Upload from '../components/Upload'

const features = [
  {
    icon: BarChart2,
    title: 'Smart Charts',
    desc: 'Auto-generated visualizations',
    color: 'from-purple-500 to-blue-500',
  },
  {
    icon: Sparkles,
    title: 'AI Insights',
    desc: 'Patterns detected instantly',
    color: 'from-blue-500 to-cyan-400',
  },
  {
    icon: MessageSquare,
    title: 'Chat with Data',
    desc: 'Ask questions naturally',
    color: 'from-pink-500 to-purple-500',
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-bg-base flex flex-col">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[30%] w-[600px] h-[600px] rounded-full bg-accent-purple opacity-[0.04] blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[20%] w-[400px] h-[400px] rounded-full bg-accent-blue opacity-[0.05] blur-[100px]" />
      </div>

      <nav className="relative z-10 flex items-center px-8 py-5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-lens flex items-center justify-center">
            <span className="text-white font-display font-bold text-sm">L</span>
          </div>
          <span className="font-display font-semibold text-text-primary text-lg">
            Lens
          </span>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent-purple/30 bg-accent-glow text-accent-purple text-sm font-medium mb-8">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered Analysis
          </div>

          <h1 className="font-display text-5xl sm:text-6xl font-bold text-text-primary leading-tight mb-4">
            See your data
            <br />
            <span className="bg-gradient-lens bg-clip-text text-transparent">
              through Lens
            </span>
          </h1>

          <p className="text-text-secondary text-lg mb-12 leading-relaxed">
            Drop a CSV and get instant charts, insights, and a chatbot
            <br className="hidden sm:block" /> to explore your data.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="max-w-xl mx-auto"
          >
            <Upload />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-16 max-w-2xl w-full"
        >
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className="bg-bg-surface border border-bg-border rounded-2xl p-5 flex flex-col items-center gap-3 text-center hover:border-accent-purple/30 transition-colors"
              >
                <div
                  className={`w-11 h-11 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center`}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-text-primary font-medium text-sm">
                    {feature.title}
                  </p>
                  <p className="text-text-muted text-xs mt-0.5">
                    {feature.desc}
                  </p>
                </div>
              </div>
            )
          })}
        </motion.div>
      </main>
    </div>
  )
}