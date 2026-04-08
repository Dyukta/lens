import { useState } from 'react'
import { MessageSquare, X, ChevronRight, ChevronLeft } from 'lucide-react'
import ChatBox from './ChatBox'

export default function ChatDock() {
  const [open, setOpen] = useState(true)

  return (
    <>
      <aside
        className={`hidden md:flex flex-col border-l transition-all duration-300 shrink-0 ${
          open ? 'w-80' : 'w-0 overflow-hidden border-l-0'
        }`}
        style={{ borderColor: 'var(--color-border)' }}
      >
        {open && <ChatBox />}
      </aside>

      <button
        className="hidden md:flex fixed top-1/2 -translate-y-1/2 z-20 w-5 h-12 items-center justify-center rounded-l-md transition-all duration-300"
        style={{
          right: open ? '320px' : '0',
          background: 'var(--color-border)',
          color: 'var(--color-muted)',
          border: '1px solid var(--color-border-hi)',
          borderRight: 'none',
        }}
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close chat' : 'Open chat'}
      >
        {open ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      <button
        className="md:hidden fixed bottom-5 right-5 z-30 w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg"
        style={{ background: 'var(--color-accent)' }}
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle chat"
      >
        <MessageSquare size={20} />
      </button>

      {open && (
        <div
          className="md:hidden fixed inset-x-0 bottom-0 z-20 h-2/3 rounded-t-2xl flex flex-col shadow-2xl"
          style={{
            background: 'var(--color-surface)',
            borderTop: '1px solid var(--color-border)',
          }}
        >
          <button
            className="absolute top-3 right-4"
            style={{ color: 'var(--color-muted)' }}
            onClick={() => setOpen(false)}
            aria-label="Close chat"
          >
            <X size={16} />
          </button>
          <ChatBox />
        </div>
      )}
    </>
  )
}