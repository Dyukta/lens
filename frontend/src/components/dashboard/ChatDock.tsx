import { useState } from 'react'
import ChatBox from './ChatBox'

export default function ChatDock() {
  const [open, setOpen] = useState(true)

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`hidden md:flex flex-col border-l transition-all duration-300 shrink-0 ${open ? 'w-80' : 'w-0 overflow-hidden border-l-0'}`}
        style={{ borderColor: 'var(--color-border)' }}
      >
        {open && <ChatBox />}
      </aside>

      {/* Desktop toggle button */}
      <button
        className="hidden md:flex fixed top-1/2 -translate-y-1/2 z-20 w-5 h-12 items-center justify-center rounded-l-md text-xs transition-colors"
        style={{
          right: open ? '320px' : '0',
          background: 'var(--color-border)',
          color: 'var(--color-muted)',
          borderColor: 'var(--color-border-hi)',
          border: '1px solid',
          borderRight: 'none',
          transition: 'right 0.3s',
        }}
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close chat' : 'Open chat'}
      >
        {open ? '›' : '‹'}
      </button>

      {/* Mobile FAB */}
      <button
        className="md:hidden fixed bottom-5 right-5 z-30 w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg"
        style={{ background: 'var(--color-accent)' }}
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle chat"
      >
        💬
      </button>

      {/* Mobile panel */}
      {open && (
        <div className="md:hidden fixed inset-x-0 bottom-0 z-20 h-2/3 rounded-t-2xl flex flex-col shadow-2xl"
          style={{ background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)' }}>
          <button
            className="absolute top-3 right-4 text-sm"
            style={{ color: 'var(--color-muted)' }}
            onClick={() => setOpen(false)}
            aria-label="Close chat"
          >
            ✕
          </button>
          <ChatBox />
        </div>
      )}
    </>
  )
}